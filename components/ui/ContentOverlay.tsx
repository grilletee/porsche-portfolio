"use client";

import { useEffect, useRef } from "react";
import { useScrollStore } from "@/store/useScrollStore";
import { getScrollTrackBounds } from "@/lib/scrollTrack";
import { CAMERA_PHASES } from "@/lib/scrollPhases";
import { getTextRevealStateStaggered } from "@/lib/textReveal";
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
  /** Tagline secundaria (debajo del body, más pequeña que el título pero
   *  mayor que el cuerpo normal). Solo se usa en hero. */
  tagline?: string;
}

type PhaseKey = "hero" | "sobre-mi" | "backend" | "frontend" | "ia" | "explode";

const BLOCKS: Record<
  PhaseKey,
  { content: PhaseContent; phase: ScrollPhase }
> = {
  hero: {
    content: {
      label: "DESARROLLADOR DE SOFTWARE",
      title: "Guillermo Sánchez",
      body: "Desarrollador Full Stack",
      side: "left",
      tagline:
        "Backend con Java y Spring Boot, IA aplicada con Python y FastAPI, e IoT con Arduino. Técnico Superior en DAM y alumno del Máster en IA y Big Data.",
    },
    phase: CAMERA_PHASES.hero,
  },
  "sobre-mi": {
    content: {
      label: "SOBRE MÍ",
      title: "Quién soy",
      body:
        "Terminé el ciclo de DAM en junio de 2026 y curso el Máster en IA y Big Data. Hice prácticas en Catuven Innovation con Odoo y automatización en Python. Me interesa la parte que no se ve: la lógica, los datos y los sistemas que hacen que todo funcione, y lo practico con proyectos propios de backend, IA y hardware.",
      side: "left",
    },
    phase: CAMERA_PHASES["sobre-mi"],
  },
  backend: {
    content: {
      label: "01 — BACKEND",
      title: "Backend con Java y Spring Boot",
      body: "API REST con Spring Boot, Spring Security (JWT) y MySQL en un CRM empresarial desarrollado en equipo, donde mi trabajo se centró en el backend.",
      side: "right",
      tags: ["Java", "Spring Boot", "JWT", "MySQL"],
    },
    phase: CAMERA_PHASES.backend,
  },
  frontend: {
    content: {
      label: "02 — FRONTEND",
      title: "Ecosistema UI",
      body: "Interfaces con Angular, React y Tailwind CSS. Este portfolio es una app Next.js con React Three Fiber.",
      side: "left",
      tags: ["Angular", "React", "Tailwind CSS"],
    },
    phase: CAMERA_PHASES.frontend,
  },
  ia: {
    content: {
      label: "03 — INTELIGENCIA ARTIFICIAL",
      title: "Agentes e IA aplicada",
      body: "Un agente de IA con herramientas externas y memoria RAG, y una API de análisis de CVs con Gemini, probada y desplegada (CV Analyzer API). Python y FastAPI en ambos.",
      side: "right",
      tags: ["Python", "FastAPI", "Gemini", "RAG"],
    },
    phase: CAMERA_PHASES.ia,
  },
  explode: {
    content: {
      label: "04 — HARDWARE",
      title: "IoT con Arduino",
      body: "Seleccionado entre el alumnado de DAM, DAW y ASIR del Instituto Nebrija para Green Campus, un proyecto de equipo que quedó 4.º en una competición nacional. Mi parte: el código Arduino del sistema. Stack: Arduino, sensores, MQTT y Node.js.",
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
  tagline: 0.012,
  tags: 0.015,
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
  const tagline = container.querySelector('[data-el="tagline"]') as HTMLElement | null;
  const tagEls = container.querySelectorAll('[data-el="tag"]') as NodeListOf<HTMLElement>;

  applyReveal(label, ...destructure(getTextRevealStateStaggered(scrollProgress, phase, STAGGER_OFFSETS.label)));
  applyReveal(accent, ...destructure(getTextRevealStateStaggered(scrollProgress, phase, STAGGER_OFFSETS.accent)));
  applyReveal(title, ...destructure(getTextRevealStateStaggered(scrollProgress, phase, STAGGER_OFFSETS.title)));
  applyReveal(body, ...destructure(getTextRevealStateStaggered(scrollProgress, phase, STAGGER_OFFSETS.body)));
  applyReveal(tagline, ...destructure(getTextRevealStateStaggered(scrollProgress, phase, STAGGER_OFFSETS.tagline)));

  const tagState = getTextRevealStateStaggered(scrollProgress, phase, STAGGER_OFFSETS.tags);
  tagEls.forEach((el) => applyRevealTag(el, tagState.opacity));
}

function destructure(s: { opacity: number; translateY: number }): [number, number] {
  return [s.opacity, s.translateY];
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------
// Altura en clase CSS (canvas-height): 100dvh con fallback a 100vh
// (Sprint 11C) — el overlay debe cubrir exactamente lo mismo que el
// Canvas en móvil, donde la barra de direcciones cambia la altura.
const OVERLAY_STYLE: React.CSSProperties = {
  position: "fixed", top: 0, left: 0, width: "100vw",
  zIndex: 10, pointerEvents: "none",
};

// Wrapper de los bloques de fase: fade out cuando el usuario supera
// el recorrido 3D y el Canvas sticky se suelta (Sprint 8).
const BLOCKS_WRAPPER_STYLE: React.CSSProperties = {
  position: "absolute", inset: 0,
  transition: "opacity 0.3s ease-out",
};

const BLOCK_CONTAINER_STYLE: React.CSSProperties = {
  position: "absolute", top: 0,
  display: "flex", alignItems: "center",
  // max(8vw, 20px): en pantallas muy estrechas el 8vw deja el texto
  // pegado al borde — 20px es el mínimo garantizado (Sprint 11C).
  padding: "0 max(8vw, 20px)",
};

const WRAPPER_STYLE: React.CSSProperties = {
  maxWidth: 540,
  // Sombra doble: el texto cae a veces sobre zonas claras del coche o del
  // fondo gris de la última fase.
  textShadow: "0 0 12px rgba(5,5,5,0.9), 0 1px 3px rgba(5,5,5,0.95)",
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
  color: "rgba(245, 245, 245, 0.9)", lineHeight: 1.6, maxWidth: "36ch",
  opacity: 0,
};

const TAGLINE_STYLE: React.CSSProperties = {
  margin: 0, marginTop: "0.6rem", fontFamily: "system-ui", fontWeight: 400,
  fontSize: "clamp(0.95rem, 1.2vw, 1.05rem)",
  color: "rgba(245, 245, 245, 0.8)", lineHeight: 1.5, maxWidth: "36ch",
  opacity: 0,
};

const TAGS_ROW_STYLE: React.CSSProperties = {
  display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap",
};

const TAG_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains-mono), monospace",
  border: "1px solid rgba(255, 59, 48, 0.6)", color: "#ff3b30",
  fontSize: "0.7rem", fontWeight: 500, letterSpacing: "0.05em",
  textTransform: "uppercase", padding: "4px 10px", borderRadius: 2,
  opacity: 0, pointerEvents: "none",
  background: "rgba(5, 5, 5, 0.7)",
};

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------
export default function ContentOverlay() {
  const heroRef = useRef<HTMLDivElement>(null!);
  const sobreMiRef = useRef<HTMLDivElement>(null!);
  const backendRef = useRef<HTMLDivElement>(null!);
  const frontendRef = useRef<HTMLDivElement>(null!);
  const iaRef = useRef<HTMLDivElement>(null!);
  const explodeRef = useRef<HTMLDivElement>(null!);

  const blockRefs: Record<PhaseKey, React.RefObject<HTMLDivElement>> = {
    hero: heroRef,
    "sobre-mi": sobreMiRef,
    backend: backendRef,
    frontend: frontendRef,
    ia: iaRef,
    explode: explodeRef,
  };

  // Indicador de disponibilidad
  const availRef = useRef<HTMLElement>(null);

  // Wrapper para el fade al salir del recorrido 3D (Sprint 8)
  const blocksWrapperRef = useRef<HTMLDivElement>(null);

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
    <div className="canvas-height" style={OVERLAY_STYLE}>
      {/* Barra superior: estado + accesos rápidos (estilos en globals.css) */}
      <nav ref={availRef} className="top-bar" aria-label="Accesos rápidos">
        <span className="status">
          <i aria-hidden="true" />
          <span>Disponible</span>
        </span>
        <a href="#proyectos">Proyectos</a>
        <a href="/cv.pdf" target="_blank" rel="noopener noreferrer">CV</a>
        <a href="#contacto">Contacto</a>
      </nav>

      {/* Bloques de fase (wrapper para fade al salir del track 3D) */}
      <div ref={blocksWrapperRef} style={BLOCKS_WRAPPER_STYLE}>
        {BLOCK_KEYS.map((key) => {
          const { content } = BLOCKS[key];
          const isLeft = content.side === "left";

          return (
            <div
              key={key}
              ref={blockRefs[key]}
              className="canvas-height"
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

                {key === "hero" ? (
                  <h1 data-el="title" style={TITLE_STYLE}>{content.title}</h1>
                ) : (
                  <h2 data-el="title" style={TITLE_STYLE}>{content.title}</h2>
                )}
                <p data-el="body" style={BODY_STYLE}>{content.body}</p>

                {/* Tagline secundaria (solo hero, Sprint 9A) */}
                {content.tagline && (
                  <p data-el="tagline" style={TAGLINE_STYLE}>{content.tagline}</p>
                )}

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

    </div>
  );
}