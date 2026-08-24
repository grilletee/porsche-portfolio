"use client";

import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "gsap";
import { useScrollStore } from "@/store/useScrollStore";
import { BG_TRANSITION } from "@/lib/scrollPhases";

/** Easing sine.inOut: curva progresiva, sin aceleración brusca. */
const easeFn = gsap.parseEase("sine.inOut");

// ---------------------------------------------------------------------------
// Colores reutilizables
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

    if (p < BG_TRANSITION.start) {
      scene.background = _colorDark;
    } else if (p < BG_TRANSITION.peak) {
      const t = easeFn(
        (p - BG_TRANSITION.start) / (BG_TRANSITION.peak - BG_TRANSITION.start),
      );
      _colorCurrent.copy(_colorDark).lerp(_colorLight, t);
      scene.background = _colorCurrent;
    } else if (p < BG_TRANSITION.end) {
      const t = easeFn(
        (p - BG_TRANSITION.peak) / (BG_TRANSITION.end - BG_TRANSITION.peak),
      );
      _colorCurrent.copy(_colorLight).lerp(_colorDark, t);
      scene.background = _colorCurrent;
    } else {
      scene.background = _colorDark;
    }
  });
}