"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useScrollStore } from "@/store/useScrollStore";
import { getActiveCameraPhase } from "@/lib/scrollPhases";

// ---------------------------------------------------------------------------
// Contenido por fase.
// La fase "transicion" no tiene contenido propio (respiro visual).
// ---------------------------------------------------------------------------
interface PhaseContent {
  label: string;
  title: string;
  body: string;
  side: "left" | "right";
}

const PHASE_CONTENT: Record<string, PhaseContent> = {
  hero: {
    label: "01 — HERO",
    title: "Guillermo",
    body: "Full Stack Developer",
    side: "left",
  },
  backend: {
    label: "02 — BACKEND",
    title: "Arquitectura y Microservicios",
    body: "Desarrollo de CRM con Java, Spring Boot, Spring Security (JWT) y bases de datos relacionales en PostgreSQL.",
    side: "right",
  },
  frontend: {
    label: "03 — FRONTEND",
    title: "Ecosistema UI",
    body: "Construcción de interfaces reactivas con Angular usando Signals, React y Tailwind CSS.",
    side: "left",
  },
  explode: {
    label: "04 — HARDWARE",
    title: "Ingeniería Inteligente",
    body: "Top 4 Nacional Eco-Digithon. Integración de microcontroladores Arduino, sensores telemétricos, MQTT y Node.js.",
    side: "right",
  },
};

// ---------------------------------------------------------------------------
// Estilos en constantes para mantener el JSX limpio.
// ---------------------------------------------------------------------------
const CONTAINER_STYLE: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  zIndex: 10,
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  padding: "0 8vw",
};

const WRAPPER_STYLE: React.CSSProperties = {
  maxWidth: 540,
  textShadow: "0 1px 8px rgba(0,0,0,0.6)",
};

const LABEL_STYLE: React.CSSProperties = {
  margin: 0,
  fontFamily: "system-ui",
  fontSize: "0.75rem",
  fontWeight: 500,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "#ff3b30",
  opacity: 0, // GSAP anima a 1
};

const ACCENT_LINE_STYLE: React.CSSProperties = {
  width: 40,
  height: 2,
  background: "#ff3b30",
  marginTop: 8,
  marginBottom: 20,
  opacity: 0,
};

const TITLE_STYLE: React.CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
  fontWeight: 700,
  fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
  letterSpacing: "-0.02em",
  textTransform: "none",
  color: "#f5f5f5",
  lineHeight: 1.05,
  opacity: 0,
};

const BODY_STYLE: React.CSSProperties = {
  margin: 0,
  marginTop: "0.75rem",
  fontFamily: "system-ui",
  fontWeight: 400,
  fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
  color: "rgba(245, 245, 245, 0.75)",
  lineHeight: 1.6,
  maxWidth: "32ch",
  opacity: 0,
};

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------
export default function ContentOverlay() {
  const scrollProgress = useScrollStore((s) => s.scrollProgress);
  const phase = getActiveCameraPhase(scrollProgress);

  const [activePhase, setActivePhase] = useState(phase.name);
  const prevPhaseRef = useRef(phase.name);

  const labelRef = useRef<HTMLParagraphElement>(null);
  const accentRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  const content = PHASE_CONTENT[activePhase] ?? null;

  // ------------------------------------------------------------------
  // Efecto: animar salida y entrada al cambiar de fase.
  // ------------------------------------------------------------------
  useEffect(() => {
    const prev = prevPhaseRef.current;
    const next = phase.name;

    if (prev === next) return;
    prevPhaseRef.current = next;

    console.log(`[ContentOverlay] fase: ${prev} → ${next}`);

    // Fase sin contenido → ocultar inmediatamente.
    if (!PHASE_CONTENT[next]) {
      setActivePhase(next);
      gsap.killTweensOf([
        labelRef.current,
        accentRef.current,
        titleRef.current,
        bodyRef.current,
      ]);
      return;
    }

    const tl = gsap.timeline();

    // 1) Fade out rápido si la fase anterior tenía contenido.
    if (PHASE_CONTENT[prev]) {
      tl.to(
        [labelRef.current, accentRef.current, titleRef.current, bodyRef.current],
        {
          opacity: 0,
          duration: 0.15,
          ease: "power2.in",
          onComplete: () => setActivePhase(next),
        },
        0,
      );
    } else {
      setActivePhase(next);
    }

    // 2) Entrada en cascada: label → accent → title → body.
    //    Cada elemento opacity 0→1 + y:20→0, ease expo.out.
    //    Stagger de ~0.08s entre cada elemento (solapan por 0.42s
    //    sobre una duración de 0.5s).
    tl.fromTo(
      labelRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" },
      0.1,
    );

    tl.fromTo(
      accentRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" },
      0.18,
    );

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" },
      0.26,
    );

    tl.fromTo(
      bodyRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" },
      0.34,
    );

    return () => {
      tl.kill();
    };
  }, [phase.name]);

  if (!content) return null;

  const isLeft = content.side === "left";

  return (
    <div
      style={{
        ...CONTAINER_STYLE,
        justifyContent: isLeft ? "flex-start" : "flex-end",
      }}
    >
      <div
        style={{
          ...WRAPPER_STYLE,
          textAlign: isLeft ? "left" : "right",
        }}
      >
        {/* Label de acento: "01 — HERO", "02 — BACKEND", etc. */}
        <p ref={labelRef} style={LABEL_STYLE}>
          {content.label}
        </p>

        {/* Línea decorativa roja. */}
        <div
          ref={accentRef}
          style={{
            ...ACCENT_LINE_STYLE,
            marginLeft: isLeft ? 0 : "auto",
            marginRight: isLeft ? "auto" : 0,
          }}
        />

        {/* Título. */}
        <h2 ref={titleRef} style={TITLE_STYLE}>
          {content.title}
        </h2>

        {/* Cuerpo. */}
        <p ref={bodyRef} style={BODY_STYLE}>
          {content.body}
        </p>
      </div>
    </div>
  );
}