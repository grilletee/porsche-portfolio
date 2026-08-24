"use client";

import { useScrollStore } from "@/store/useScrollStore";
import { gsap } from "gsap";

/** Easing expo.inOut, coherente con el resto de la coreografía. */
const easeFn = gsap.parseEase("expo.inOut");

/**
 * Hook que devuelve el factor de explosión (0 a 1) basado en
 * scrollProgress. La vista explosionada se activa entre
 * scroll 0.8 y 1.0, con easing expo.inOut para un timing seco.
 */
export function useExplodedView(): number {
  const scrollProgress = useScrollStore((s) => s.scrollProgress);
  const p = scrollProgress;

  if (p < 0.8) return 0;
  if (p >= 1.0) return 1;

  const raw = (p - 0.8) / 0.2;
  return easeFn(raw);
}