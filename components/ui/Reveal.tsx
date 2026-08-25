"use client";

import { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  /** Retardo en segundos (para cascadas dentro de una misma sección). */
  delay?: number;
}

/**
 * Aparición simple al entrar en viewport (IntersectionObserver).
 * Usado por las secciones HTML posteriores al recorrido 3D — no está
 * ligado a scrollProgress ni a GSAP, solo a la visibilidad real.
 */
export default function Reveal({ children, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
