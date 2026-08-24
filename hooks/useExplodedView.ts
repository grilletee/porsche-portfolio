"use client";

import { useScrollStore } from "@/store/useScrollStore";
import { gsap } from "gsap";
import { EXPLODE_RANGE } from "@/lib/scrollPhases";

/** Easing expo.inOut, coherente con el resto de la coreografía. */
const easeFn = gsap.parseEase("expo.inOut");

/**
 * Hook que devuelve el factor de explosión (0 a 1) basado en
 * scrollProgress, activado en el rango definido por EXPLODE_RANGE.
 */
export function useExplodedView(): number {
  const scrollProgress = useScrollStore((s) => s.scrollProgress);
  const p = scrollProgress;

  if (p < EXPLODE_RANGE.start) return 0;
  if (p >= EXPLODE_RANGE.end) return 1;

  const raw =
    (p - EXPLODE_RANGE.start) / (EXPLODE_RANGE.end - EXPLODE_RANGE.start);
  return easeFn(raw);
}