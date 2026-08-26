"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "gsap";
import { useScrollStore } from "@/store/useScrollStore";
import { CAMERA_SEGMENTS } from "@/lib/cameraPath";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Easing por defecto: expo.inOut (timing seco y agresivo). Los
 * segmentos pueden sobreescribirlo con la propiedad `easing`.
 */
const _defaultEase = gsap.parseEase("expo.inOut");
const _easeCache: Record<string, (t: number) => number> = {
  "expo.out": gsap.parseEase("expo.out"),
};

function getEase(easing: string | undefined): (t: number) => number {
  if (!easing) return _defaultEase;
  if (!_easeCache[easing]) {
    _easeCache[easing] = gsap.parseEase(easing);
  }
  return _easeCache[easing];
}

// ---------------------------------------------------------------------------
// Vectores reutilizables (se mutan en cada frame para evitar allocs).
// ---------------------------------------------------------------------------
const _posFrom = new THREE.Vector3();
const _posTo = new THREE.Vector3();
const _lookFrom = new THREE.Vector3();
const _lookTo = new THREE.Vector3();
const _currentPos = new THREE.Vector3();
const _currentLook = new THREE.Vector3();

// ---------------------------------------------------------------------------
// Hook — se usa DENTRO del Canvas (requiere acceso a useThree / useFrame)
// ---------------------------------------------------------------------------
export function useCameraAnimation() {
  const scrollProgress = useScrollStore((s) => s.scrollProgress);
  const { camera } = useThree();

  // Sprint 11D: con prefers-reduced-motion la cámara usa una curva
  // mucho más suave (power1.inOut) en lugar de expo.inOut/out — se
  // mantiene el movimiento, solo se reduce su brusquedad.
  const reducedMotion = usePrefersReducedMotion();

  useFrame(() => {
    const p = scrollProgress;

    // ---- Cámara: buscar el tramo activo ----
    let segment = CAMERA_SEGMENTS[0];
    for (let i = CAMERA_SEGMENTS.length - 1; i >= 0; i--) {
      if (p >= CAMERA_SEGMENTS[i].scrollStart) {
        segment = CAMERA_SEGMENTS[i];
        break;
      }
    }

    // Progreso local dentro del tramo, con easing aplicado.
    const range = segment.scrollEnd - segment.scrollStart;
    const localRaw = range > 0 ? (p - segment.scrollStart) / range : 0;
    const localClamped = Math.max(0, Math.min(1, localRaw));

    const holdFraction = segment.holdFraction ?? 0;
    const transitFraction = 1 - holdFraction;
    const transitProgress =
      transitFraction > 0
        ? Math.max(0, Math.min(1, localClamped / transitFraction))
        : 1;

    const easeName = reducedMotion ? "power1.inOut" : segment.easing;
    const easeFn = getEase(easeName);
    const t = easeFn(transitProgress);

    // Interpolar posición y lookAt con Vector3.lerpVectors.
    _posFrom.set(...segment.fromPosition);
    _posTo.set(...segment.toPosition);
    _lookFrom.set(...segment.fromLookAt);
    _lookTo.set(...segment.toLookAt);

    _currentPos.lerpVectors(_posFrom, _posTo, t);
    _currentLook.lerpVectors(_lookFrom, _lookTo, t);

    camera.position.copy(_currentPos);
    camera.lookAt(_currentLook);
  });
}