"use client";

import { useEffect, useState } from "react";

/**
 * Detecta la media query prefers-reduced-motion (Sprint 11D).
 * El 3D nunca se desactiva con esta preferencia: solo se suaviza la
 * brusquedad del movimiento (easing de cámara + velocidad de Lenis).
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);

    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
