"use client";

import { useEffect, useRef } from "react";
import { useScrollStore } from "@/store/useScrollStore";
import { getScrollTrackBounds } from "@/lib/scrollTrack";
import { CAMERA_PHASES } from "@/lib/scrollPhases";
import { getTextRevealStateStaggered, getTextRevealState } from "@/lib/textReveal";
import type { ScrollPhase } from "@/lib/scrollPhases";

// ---------------------------------------------------------------------------
// Contenido por fase (Sprint 7C: renumerado, añadida fase ia + tags).
// ---------------------------------------------------------------------------
interface PhaseContent {
  label: string;
  title: string;
  body: string;
  side: "left" | "right";
  tags?: string[];
}

type PhaseKey = "hero" | "backend" | "frontend" | "ia" | "explode";

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
      tags: ["Java", "Spring Boot", "JWT", "PostgreSQL"],
    },
    phase: CAMERA_PHASES.backend,
  },
  frontend: {
    content: {
      label: "03 — FRONTEND",
      title: "Ecosistema UI",
      body: "Construcción de interfaces reactivas con Angular usando Signals, React y Tailwind CSS.",
      side: "left",
      tags: ["Angular", "React", "Tailwind CSS"],
    },
    phase: CAMERA_PHASES.frontend,
  },
  ia: {
    content: {
      label: "04 — INTELIGENCIA ARTIFICIAL",
      title: "Agentes e Inteligencia Aplicada",
      body: "Desarrollo de agentes de IA autónomos con memoria RAG (TCG Agent) y APIs de análisis inteligente con Google Gemini (CV Analyzer API), construidos en Python con FastAPI y bases de datos vectoriales.",
      side: "right",
      tags: ["Python", "FastAPI", "Google Gemini", "RAG"],
    },
    phase: CAMERA_PHASES.ia,
  },
  explode: {
    content: {
      label: "05 — HARDWARE",
      title: "Ingeniería Inteligente",
      body: "Top 4 Nacional Eco-Digithon. Integración de microcontroladores Arduino, sensores telemétricos, MQTT y Node.js.",
      side: "left",
      tags: ["Arduino", "MQTT", "Node.js", "IoT"],
    },
    phase: CAMERA_PHASES.explode,
  },
};

const BLOCK_KEYS = Object.keys(BLOCKS) as PhaseKey[];

// ---------------------------------------------------------------------------
// Stagger offsets entre sub-elementos.
// ---------------------------------------------------------------------------
const STAGGER_OFFSETS = {
  label: 0,
  accent: 0.003,
  title: 0.006,
  body: 0.009,
  tags: 0.012,
};

// ---------------------------------------------------------------------------
// Helpers DOM
// ---------------------------------------------------------------------------
function applyReveal(el: HTMLElement | null, opacity: number, translateY: number) {
  if (!el) return;
  el.style.opacity = String(opacity);
  el.style.transform = `translateY(${translateY}px)`;
}

function applyRevealTag(el: HTMLElement | null, opacity: number) {
  if (!el) return;
  el.style.opacity = String(opacity);
}

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
  const tagEls = container.querySelectorAll('[data-el="tag"]') as NodeListOf<HTMLElement>;

  applyReveal(label, ...destructure(getTextRevealStateStaggered(scrollProgress, phase, STAGGER_OFFSETS.label)));
  applyReveal(accent, ...destructure(getTextRevealStateStaggered(scrollProgress, phase, STAGGER_OFFSETS.accent)));
  applyReveal(title, ...destructure(getTextRevealStateStaggered(scrollProgress, phase, STAGGER_OFFSETS.title)));
  applyReveal(body, ...destructure(getTextRevealStateStaggered(scrollProgress, phase, STAGGER_OFFSETS.body)));

  const tagState = getTextRevealStateStaggered(scrollProgress, phase, STAGGER_OFFSETS.tags);
  tagEls.forEach((el) => applyRevealTag(el, tagState.opacity));
}

function destructure(s: { opacity: number; translateY: number }): [number, number] {
  return [s.opacity, s.translateY];
}

// ---------------------------------------------------------------------------
// CTA en la fase explode (scroll > 0.92)
// ---------------------------------------------------------------------------
const CTA_PHASE: ScrollPhase = { name: "cta", start: 0.92, end: 1.0 };

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------
const OVERLAY_STYLE: React.CSSProperties = {
  position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
  zIndex: 10, pointerEvents: "none",
};

// Wrapper de los bloques de fase: fade out cuando el usuario supera
// el recorrido 3D y el Canvas sticky se suelta (Sprint 8).
const BLOCKS_WRAPPER_STYLE: React.CSSProperties = {
  position: "absolute", inset: 0,
  transition: "opacity 0.3s ease-out",
};

const BLOCK_CONTAINER_STYLE: React.CSSProperties = {
  position: "absolute", top: 0, height: "100vh",
  display: "flex", alignItems: "center", padding: "0 8vw",
};

const WRAPPER_STYLE: React.CSSProperties = {
  maxWidth: 540, textShadow: "0 1px 8px rgba(0,0,0,0.6)",
};

const LABEL_STYLE: React.CSSProperties = {
  margin: 0, fontFamily: "var(--font-jetbrains-mono), monospace",
  fontSize: "0.75rem", fontWeight: 500,
  letterSpacing: "0.15em", textTransform: "uppercase", color: "#ff3b30",
  opacity: 0,
};

const ACCENT_LINE_STYLE: React.CSSProperties = {
  width: 40, height: 2, background: "#ff3b30",
  marginTop: 8, marginBottom: 20, opacity: 0,
};

const TITLE_STYLE: React.CSSProperties = {
  margin: 0, fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
  fontWeight: 700, fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
  letterSpacing: "-0.02em", textTransform: "none", color: "#f5f5f5",
  lineHeight: 1.05, opacity: 0,
};

const BODY_STYLE: React.CSSProperties = {
  margin: 0, marginTop: "0.75rem", fontFamily: "system-ui", fontWeight: 400,
  fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
  color: "rgba(245, 245, 245, 0.75)", lineHeight: 1.6, maxWidth: "32ch",
  opacity: 0,
};

const TAGS_ROW_STYLE: React.CSSProperties = {
  display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap",
};

const TAG_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains-mono), monospace",
  border: "1px solid rgba(255, 59, 48, 0.6)", color: "rgba(255, 59, 48, 0.6)",
  fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.05em",
  textTransform: "uppercase", padding: "4px 10px", borderRadius: 2,
  opacity: 0, pointerEvents: "none",
};

// ---- Indicador "Disponible" persistente ----
const AVAIL_INDICATOR_STYLE: React.CSSProperties = {
  position: "fixed", top: 20, right: 24, zIndex: 11,
  display: "flex", alignItems: "center", gap: 8,
  opacity: 0.5, transition: "opacity 0.2s",
  pointerEvents: "auto",
};

const AVAIL_DOT_STYLE: React.CSSProperties = {
  width: 7, height: 7, borderRadius: "50%", background: "#4ade80",
  boxShadow: "0 0 6px rgba(74, 222, 128, 0.5)",
};

const AVAIL_TEXT_STYLE: React.CSSProperties = {
  fontFamily: "system-ui", fontSize: "0.65rem", fontWeight: 500,
  letterSpacing: "0.1em", textTransform: "uppercase", color: "#f5f5f5",
};

// ---- CTA final ----
const CTA_CONTAINER_STYLE: React.CSSProperties = {
  position: "fixed", bottom: 0, left: 0, width: "100vw",
  zIndex: 11, pointerEvents: "none",
  display: "flex", justifyContent: "center", padding: "0 8vw 10vh",
  transition: "opacity 0.3s ease-out",
};

const CTA_WRAPPER_STYLE: React.CSSProperties = {
  textAlign: "center", maxWidth: 420,
  textShadow: "0 1px 8px rgba(0,0,0,0.6)",
};

const CTA_TITLE_STYLE: React.CSSProperties = {
  margin: 0, fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
  fontWeight: 700, fontSize: "clamp(2rem, 4vw, 3.5rem)",
  color: "#f5f5f5", lineHeight: 1.1, opacity: 0,
};

const CTA_BUTTON_STYLE: React.CSSProperties = {
  display: "inline-block", marginTop: 16,
  padding: "14px 36px", background: "#f5f5f5", color: "#050505",
  fontFamily: "system-ui", fontSize: "1rem", fontWeight: 600,
  letterSpacing: "0.03em", textDecoration: "none",
  borderRadius: 2, opacity: 0, pointerEvents: "auto",
  transition: "opacity 0.15s",
};

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------
export default function ContentOverlay() {
  const heroRef = useRef<HTMLDivElement>(null!);
  const backendRef = useRef<HTMLDivElement>(null!);
  const frontendRef = useRef<HTMLDivElement>(null!);
  const iaRef = useRef<HTMLDivElement>(null!);
  const explodeRef = useRef<HTMLDivElement>(null!);

  const blockRefs: Record<PhaseKey, React.RefObject<HTMLDivElement>> = {
    hero: heroRef,
    backend: backendRef,
    frontend: frontendRef,
    ia: iaRef,
    explode: explodeRef,
  };

  // CTA refs
  const ctaTitleRef = useRef<HTMLHeadingElement>(null);
  const ctaButtonRef = useRef<HTMLAnchorElement>(null);

  // Indicador de disponibilidad
  const availRef = useRef<HTMLDivElement>(null);

  // Wrappers para el fade al salir del recorrido 3D (Sprint 8)
  const blocksWrapperRef = useRef<HTMLDivElement>(null);
  const ctaWrapperRef = useRef<HTMLDivElement>(null);

  // ------------------------------------------------------------------
  // Suscripción continua
  // ------------------------------------------------------------------
  useEffect(() => {
    const unsub = useScrollStore.subscribe((state) => {
      const p = state.scrollProgress;

      // Bloques de fase
      for (const key of BLOCK_KEYS) {
        updateBlock(blockRefs[key].current, p, BLOCKS[key].phase);
      }

      // CTA final (aparece al final, scroll > 0.92)
      const ctaTitleState = getTextRevealStateStaggered(p, CTA_PHASE, 0);
      const ctaBtnState = getTextRevealStateStaggered(p, CTA_PHASE, 0.003);
      applyReveal(ctaTitleRef.current, ctaTitleState.opacity, ctaTitleState.translateY);
      applyReveal(ctaButtonRef.current, ctaBtnState.opacity, ctaBtnState.translateY);

      // Indicador de disponibilidad: visible desde hero en adelante
      if (availRef.current) {
        availRef.current.style.opacity = p < CAMERA_PHASES.hero.start ? "0" : "1";
      }
    });

    const p = useScrollStore.getState().scrollProgress;
    for (const key of BLOCK_KEYS) {
      updateBlock(blockRefs[key].current, p, BLOCKS[key].phase);
    }
    if (availRef.current) {
      availRef.current.style.opacity = p < CAMERA_PHASES.hero.start ? "0" : "1";
    }

    // Fade del overlay al superar el recorrido 3D: cuando el sticky se
    // suelta (scrollY > bottom del track - viewport), los bloques de
    // fase y el CTA desaparecen para no tapar las secciones HTML de
    // abajo. Se escucha el scroll nativo porque scrollProgress queda
    // clavado en 1 y el store ya no emite cambios.
    let lastPastTrack = false;
    const applyTrackFade = () => {
      const { bottom } = getScrollTrackBounds();
      const pastTrack = window.scrollY > bottom - window.innerHeight;
      if (pastTrack !== lastPastTrack) {
        lastPastTrack = pastTrack;
        if (blocksWrapperRef.current) {
          blocksWrapperRef.current.style.opacity = pastTrack ? "0" : "1";
        }
        if (ctaWrapperRef.current) {
          ctaWrapperRef.current.style.opacity = pastTrack ? "0" : "1";
        }
      }
    };
    applyTrackFade();
    window.addEventListener("scroll", applyTrackFade, { passive: true });
    window.addEventListener("resize", applyTrackFade);

    return () => {
      unsub();
      window.removeEventListener("scroll", applyTrackFade);
      window.removeEventListener("resize", applyTrackFade);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  return (
    <div style={OVERLAY_STYLE}>
      {/* Indicador "Disponible" persistente (esquina superior derecha) */}
      <div
        ref={availRef}
        style={AVAIL_INDICATOR_STYLE}
        onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = "1"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.opacity = "0.5"; }}
      >
        <span style={AVAIL_DOT_STYLE} />
        <span style={AVAIL_TEXT_STYLE}>Disponible</span>
      </div>

      {/* Bloques de fase (wrapper para fade al salir del track 3D) */}
      <div ref={blocksWrapperRef} style={BLOCKS_WRAPPER_STYLE}>
        {BLOCK_KEYS.map((key) => {
          const { content } = BLOCKS[key];
          const isLeft = content.side === "left";

          return (
            <div
              key={key}
              ref={blockRefs[key]}
              style={{
                ...BLOCK_CONTAINER_STYLE,
                left: 0, right: 0,
                justifyContent: isLeft ? "flex-start" : "flex-end",
              }}
            >
              <div style={{ ...WRAPPER_STYLE, textAlign: isLeft ? "left" : "right" }}>
                <p data-el="label" style={LABEL_STYLE}>{content.label}</p>

                <div
                  data-el="accent"
                  style={{
                    ...ACCENT_LINE_STYLE,
                    marginLeft: isLeft ? 0 : "auto",
                    marginRight: isLeft ? "auto" : 0,
                  }}
                />

                <h2 data-el="title" style={TITLE_STYLE}>{content.title}</h2>
                <p data-el="body" style={BODY_STYLE}>{content.body}</p>

                {/* Tags de stack */}
                {content.tags && (
                  <div style={TAGS_ROW_STYLE}>
                    {content.tags.map((tag) => (
                      <span key={tag} data-el="tag" style={TAG_STYLE}>{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA final */}
      <div ref={ctaWrapperRef} style={CTA_CONTAINER_STYLE}>
        <div style={CTA_WRAPPER_STYLE}>
          <h3 ref={ctaTitleRef} style={CTA_TITLE_STYLE}>
            ¿Hablamos?
          </h3>
          <a
            ref={ctaButtonRef}
            href="mailto:grillete07@gmail.com"
            style={{
              ...CTA_BUTTON_STYLE,
              display: "inline-block",
            }}
          >
            Contrátame
          </a>
        </div>
      </div>
    </div>
  );
}