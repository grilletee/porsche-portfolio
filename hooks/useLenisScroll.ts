"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollStore } from "@/store/useScrollStore";

gsap.registerPlugin(ScrollTrigger);

export function useLenisScroll() {
  const setScrollProgress = useScrollStore((s) => s.setScrollProgress);

  useEffect(() => {
    const lenis = new Lenis({
      // Suavizado: lerp bajo = respuesta seca, rápida (consistente
      // con la visión de curvas agresivas tipo expo del proyecto).
      lerp: 0.08,
      smoothWheel: true,
    });

    // Sincronizar Lenis con GSAP ScrollTrigger.
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time: number) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Actualizar el store con el progreso de scroll (0 a 1).
    const updateProgress = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const maxScroll = docHeight - windowHeight;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
      setScrollProgress(progress);
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