"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "gsap";
import { useScrollStore } from "@/store/useScrollStore";

/**
 * Easing sine.inOut: curva sinusoidal progresiva, sin aceleración brusca.
 * Adecuado para transiciones de color de fondo que deben percibirse
 * como un cambio gradual, no como un flash.
 */
const easeFn = gsap.parseEase("sine.inOut");

// ---------------------------------------------------------------------------
// Colores y vector reutilizables (se mutan en cada frame para
// evitar allocs de GC dentro del render loop de R3F).
// ---------------------------------------------------------------------------
const _colorDark = new THREE.Color("#050505");
const _colorLight = new THREE.Color("#e8e8e8");
const _colorCurrent = new THREE.Color();

// ---------------------------------------------------------------------------
// Hook — se usa DENTRO del Canvas (requiere acceso a useThree / useFrame)
// ---------------------------------------------------------------------------
export function useBackgroundColor() {
  const scrollProgress = useScrollStore((s) => s.scrollProgress);
  const { scene } = useThree();

  useFrame(() => {
    const p = scrollProgress;

    // Transición de fondo suave entre scroll 0.35 y 0.75:
    // Subida: #050505 → #e8e8e8 (0.35 → 0.55)
    // Bajada: #e8e8e8 → #050505 (0.55 → 0.75)
    // Fuera de ese rango: #050505 fijo.
    if (p < 0.35) {
      scene.background = _colorDark;
    } else if (p < 0.55) {
      const t = easeFn((p - 0.35) / 0.2);
      _colorCurrent.copy(_colorDark).lerp(_colorLight, t);
      scene.background = _colorCurrent;
    } else if (p < 0.75) {
      const t = easeFn((p - 0.55) / 0.2);
      _colorCurrent.copy(_colorLight).lerp(_colorDark, t);
      scene.background = _colorCurrent;
    } else {
      scene.background = _colorDark;
    }
  });
}