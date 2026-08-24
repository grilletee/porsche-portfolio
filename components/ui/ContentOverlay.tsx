"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useScrollStore } from "@/store/useScrollStore";
import {
  getActiveCameraPhase,
  CAMERA_PHASES,
} from "@/lib/scrollPhases";

// ---------------------------------------------------------------------------
// Contenido por fase (sin fase "transicion" — es un respiro visual).
// ---------------------------------------------------------------------------
interface PhaseContent {
  title: string;
  body: string;
  /** Lado: izquierda o derecha del viewport. */
  side: "left" | "right";
}

const PHASE_CONTENT: Record<string, PhaseContent> = {
  hero: {
    title: "Guillermo",
    body: "Full Stack Developer",
    side: "left",
  },
  backend: {
    title: "Arquitectura y Microservicios",
    body: "Desarrollo de CRM con Java, Spring Boot, Spring Security (JWT) y bases de datos relacionales en PostgreSQL.",
    side: "right",
  },
  frontend: {
    title: "Ecosistema UI",
    body: "Construcción de interfaces reactivas con Angular usando Signals, React y Tailwind CSS.",
    side: "left",
  },
  explode: {
    title: "Ingeniería Inteligente",
    body: "Top 4 Nacional Eco-Digithon. Integración de microcontroladores Arduino, sensores telemétricos, MQTT y Node.js.",
    side: "right",
  },
};

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------
export default function ContentOverlay() {
  const scrollProgress = useScrollStore((s) => s.scrollProgress);
  const phase = getActiveCameraPhase(scrollProgress);

  const [activePhase, setActivePhase] = useState(phase.name);
  const prevPhaseRef = useRef(phase.name);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const content = PHASE_CONTENT[activePhase] ?? null;

  // ------------------------------------------------------------------
  // Efecto: cuando cambia la fase, animar salida del bloque anterior
  // y entrada del nuevo con stagger expo.out.
  // ------------------------------------------------------------------
  useEffect(() => {
    const prev = prevPhaseRef.current;
    const next = phase.name;

    // Si no cambió la fase, no hacer nada.
    if (prev === next) return;
    prevPhaseRef.current = next;

    // Si la nueva fase no tiene contenido, ocultar inmediatamente.
    if (!PHASE_CONTENT[next]) {
      setActivePhase(next);
      gsap.killTweensOf([titleRef.current, bodyRef.current]);
      return;
    }

    const tl = gsap.timeline();

    // 1) Salida del bloque anterior (fade out rápido).
    if (PHASE_CONTENT[prev]) {
      tl.to(
        [titleRef.current, bodyRef.current],
        {
          opacity: 0,
          duration: 0.15,
          ease: "power2.in",
          onComplete: () => {
            // Cambiar el contenido DOM *después* del fade out.
            setActivePhase(next);
          },
        },
        0,
      );
    } else {
      // Si la fase anterior no tenía contenido, mostrar la nueva ya.
      setActivePhase(next);
    }

    // 2) Entrada del nuevo bloque: stagger con expo.out.
    //    opacity 0→1 + y: 20→0. Título primero, cuerpo justo después.
    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "expo.out",
      },
      "+=0.1", // pequeño delay tras el cambio de contenido
    );

    tl.fromTo(
      bodyRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "expo.out",
      },
      "-=0.35", // stagger de ~0.08s efectivo (salen casi juntos pero en cascada)
    );

    return () => {
      tl.kill();
    };
  }, [phase.name]);

  // Si la fase activa no tiene contenido, no renderizar nada.
  if (!content) return null;

  const isLeft = content.side === "left";

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 10,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: isLeft ? "flex-start" : "flex-end",
        padding: "0 8vw",
      }}
    >
      <div
        style={{
          maxWidth: 420,
          textAlign: isLeft ? "left" : "right",
          color: "#f5f5f5",
          // Sombra de texto: legibilidad sobre fondo claro (fase transición)
          textShadow: "0 1px 8px rgba(0,0,0,0.6)",
        }}
      >
        <h2
          ref={titleRef}
          style={{
            margin: 0,
            fontSize: "2rem",
            fontWeight: 600,
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            opacity: 0, // GSAP lo anima a 1
          }}
        >
          {content.title}
        </h2>
        <p
          ref={bodyRef}
          style={{
            margin: "12px 0 0",
            fontSize: "1.05rem",
            fontWeight: 400,
            lineHeight: 1.55,
            opacity: 0,
            color: "#cccccc",
          }}
        >
          {content.body}
        </p>
      </div>
    </div>
  );
}