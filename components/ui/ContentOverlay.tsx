"use client";

import { useEffect, useRef } from "react";
import { useScrollStore } from "@/store/useScrollStore";
import { CAMERA_PHASES } from "@/lib/scrollPhases";
import { getTextRevealStateStaggered } from "@/lib/textReveal";
import type { ScrollPhase } from "@/lib/scrollPhases";

// ---------------------------------------------------------------------------
// Contenido por fase.
// "transicion" no tiene bloque (es un respiro visual).
// ---------------------------------------------------------------------------
interface PhaseContent {
  label: string;
  title: string;
  body: string;
  side: "left" | "right";
}

type PhaseKey = "hero" | "backend" | "frontend" | "explode";

const BLOCKS: Record<
  PhaseKey,
  { content: PhaseContent; phase: ScrollPhase }
> = {
  hero: {
    content: {
      label: "01 — HERO",
      title: "Guillermo",
      body: "Full Stack Developer",
      side: "left",
    },
    phase: CAMERA_PHASES.hero,
  },
  backend: {
    content: {
      label: "02 — BACKEND",
      title: "Arquitectura y Microservicios",
      body: "Desarrollo de CRM con Java, Spring Boot, Spring Security (JWT) y bases de datos relacionales en PostgreSQL.",
      side: "right",
    },
    phase: CAMERA_PHASES.backend,
  },
  frontend: {
    content: {
      label: "03 — FRONTEND",
      title: "Ecosistema UI",
      body: "Construcción de interfaces reactivas con Angular usando Signals, React y Tailwind CSS.",
      side: "left",
    },
    phase: CAMERA_PHASES.frontend,
  },
  explode: {
    content: {
      label: "04 — HARDWARE",
      title: "Ingeniería Inteligente",
      body: "Top 4 Nacional Eco-Digithon. Integración de microcontroladores Arduino, sensores telemétricos, MQTT y Node.js.",
      side: "right",
    },
    phase: CAMERA_PHASES.explode,
  },
};

const BLOCK_KEYS = Object.keys(BLOCKS) as PhaseKey[];

// ---------------------------------------------------------------------------
// Stagger offsets (en unidades de scrollProgress) entre sub-elementos.
// label primero, acento, título y cuerpo en cascada de ~0.08s cada uno.
// ---------------------------------------------------------------------------
const STAGGER_OFFSETS = {
  label: 0,
  accent: 0.003,
  title: 0.006,
  body: 0.009,
};

// ---------------------------------------------------------------------------
// Helper: aplica un RevealState directamente al DOM de un elemento.
// ---------------------------------------------------------------------------
function applyReveal(el: HTMLElement | null, opacity: number, translateY: number) {
  if (!el) return;
  el.style.opacity = String(opacity);
  el.style.transform = `translateY(${translateY}px)`;
}

// ---------------------------------------------------------------------------
// Helper: actualiza los 4 sub-elementos de un bloque desde un contenedor.
// ---------------------------------------------------------------------------
function updateBlock(
  container: HTMLDivElement | null,
  scrollProgress: number,
  phase: ScrollPhase,
) {
  if (!container) return;

  const label = container.querySelector('[data-el="label"]') as HTMLElement | null;
  const accent = container.querySelector('[data-el="accent"]') as HTMLElement | null;
  const title = container.querySelector('[data-el="title"]') as HTMLElement | null;
  const body = container.querySelector('[data-el="body"]') as HTMLElement | null;

  const sLabel = getTextRevealStateStaggered(scrollProgress, phase, STAGGER_OFFSETS.label);
  const sAccent = getTextRevealStateStaggered(scrollProgress, phase, STAGGER_OFFSETS.accent);
  const sTitle = getTextRevealStateStaggered(scrollProgress, phase, STAGGER_OFFSETS.title);
  const sBody = getTextRevealStateStaggered(scrollProgress, phase, STAGGER_OFFSETS.body);

  applyReveal(label, sLabel.opacity, sLabel.translateY);
  applyReveal(accent, sAccent.opacity, sAccent.translateY);
  applyReveal(title, sTitle.opacity, sTitle.translateY);
  applyReveal(body, sBody.opacity, sBody.translateY);
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------
const OVERLAY_STYLE: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  zIndex: 10,
  pointerEvents: "none",
};

const BLOCK_CONTAINER_STYLE: React.CSSProperties = {
  position: "absolute",
  top: 0,
  height: "100vh",
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
  opacity: 0,
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
  // Refs a los contenedores de cada bloque.
  const heroRef = useRef<HTMLDivElement>(null!);
  const backendRef = useRef<HTMLDivElement>(null!);
  const frontendRef = useRef<HTMLDivElement>(null!);
  const explodeRef = useRef<HTMLDivElement>(null!);

  const blockRefs: Record<PhaseKey, React.RefObject<HTMLDivElement>> = {
    hero: heroRef,
    backend: backendRef,
    frontend: frontendRef,
    explode: explodeRef,
  };

  // ------------------------------------------------------------------
  // Suscripción continua al store: en cada cambio de scrollProgress,
  // recalcula el estado de revelado de los 4 bloques y lo aplica
  // directamente al DOM (sin pasar por setState de React).
  // ------------------------------------------------------------------
  useEffect(() => {
    const unsub = useScrollStore.subscribe((state) => {
      const p = state.scrollProgress;
      for (const key of BLOCK_KEYS) {
        updateBlock(blockRefs[key].current, p, BLOCKS[key].phase);
      }
    });

    // También calcular una vez al montar (antes del primer evento de scroll).
    const p = useScrollStore.getState().scrollProgress;
    for (const key of BLOCK_KEYS) {
      updateBlock(blockRefs[key].current, p, BLOCKS[key].phase);
    }

    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------------------------------------------------------
  // Render: los 4 bloques están siempre en el DOM.
  // ------------------------------------------------------------------
  return (
    <div style={OVERLAY_STYLE}>
      {BLOCK_KEYS.map((key) => {
        const { content } = BLOCKS[key];
        const isLeft = content.side === "left";

        return (
          <div
            key={key}
            ref={blockRefs[key]}
            style={{
              ...BLOCK_CONTAINER_STYLE,
              left: 0,
              right: 0,
              justifyContent: isLeft ? "flex-start" : "flex-end",
            }}
          >
            <div
              style={{
                ...WRAPPER_STYLE,
                textAlign: isLeft ? "left" : "right",
              }}
            >
              <p data-el="label" style={LABEL_STYLE}>
                {content.label}
              </p>

              <div
                data-el="accent"
                style={{
                  ...ACCENT_LINE_STYLE,
                  marginLeft: isLeft ? 0 : "auto",
                  marginRight: isLeft ? "auto" : 0,
                }}
              />

              <h2 data-el="title" style={TITLE_STYLE}>
                {content.title}
              </h2>

              <p data-el="body" style={BODY_STYLE}>
                {content.body}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}