"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollStore } from "@/store/useScrollStore";
import { getScrollTrackBounds } from "@/lib/scrollTrack";

gsap.registerPlugin(ScrollTrigger);

export function useLenisScroll() {
  const setScrollProgress = useScrollStore((s) => s.setScrollProgress);

  useEffect(() => {
    const lenis = new Lenis({
      // Suavizado: lerp bajo = respuesta seca, rápida (consistente
      // con la visión de curvas agresivas tipo expo del proyecto).
      lerp: 0.08,
      smoothWheel: true,
      // Sprint 11B: en táctil el scroll nativo del navegador se siente
      // mejor que uno interpolado artificialmente. En esta versión de
      // Lenis (1.3.x) no existe smoothTouch: el touch ya es nativo por
      // defecto (solo se suaviza la rueda con smoothWheel) y
      // touchMultiplier: 1 lo deja sin amplificar.
      touchMultiplier: 1,
    });

    // Sincronizar Lenis con GSAP ScrollTrigger.
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time: number) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Actualizar el store con el progreso de scroll (0 a 1).
    // Sprint 8: el progreso se calcula SOLO contra el recorrido 3D
    // (el contenedor del Canvas sticky), no contra el documento entero
    // — así no se diluye con las secciones HTML que van después.
    const updateProgress = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const { top, height } = getScrollTrackBounds();
      const scrollable = height - windowHeight;
      const progress = scrollable > 0 ? (scrollY - top) / scrollable : 0;
      setScrollProgress(Math.min(1, Math.max(0, progress)));
    };

    // Escuchar el evento scroll nativo para calcular progreso.
    lenis.on("scroll", updateProgress);

    // También actualizamos al hacer resize.
    window.addEventListener("resize", updateProgress);

    return () => {
      lenis.destroy();
      window.removeEventListener("resize", updateProgress);
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [setScrollProgress]);
}