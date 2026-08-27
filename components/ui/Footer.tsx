"use client";

import Reveal from "./Reveal";
import TechButton from "./TechButton";
import { BODY_STYLE, TITLE_STYLE } from "./sectionStyles";

// ---------------------------------------------------------------------------
// Footer (Sprint 8C): CTA de contacto + LinkedIn + GitHub + descarga CV.
// El archivo /public/cv.pdf lo coloca el usuario manualmente.
// ---------------------------------------------------------------------------
const FOOTER_STYLE: React.CSSProperties = {
  background: "#050505",
  borderTop: "1px solid rgba(245, 245, 245, 0.08)",
  // Sprint 12E: safe-area inferior para que la última línea no quede
  // tapada por la barra de gestos en iPhone.
  padding: "12vh 8vw calc(8vh + env(safe-area-inset-bottom))",
  textAlign: "center",
};

const LINKS_ROW_STYLE: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: 32,
  flexWrap: "wrap",
  marginTop: 40,
};

const LINK_STYLE: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  // Sprint 12E: área de toque mínima de 44px (accesibilidad táctil).
  minHeight: 44,
  padding: "0 8px",
  fontFamily: "var(--font-jetbrains-mono), monospace",
  fontSize: "0.8rem",
  fontWeight: 500,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#f5f5f5",
  textDecoration: "none",
  transition: "color 0.2s",
  cursor: "pointer",
};

// Bloque CTA: todo comparte el mismo eje vertical (flex column centrado)
// y el mismo max-width, para que título, texto y botón estén centrados
// como conjunto (Sprint 10B).
const CTA_BLOCK_STYLE: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 16,
  maxWidth: 640,
  margin: "0 auto",
};

const FOOTER_NOTE_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains-mono), monospace",
  fontSize: "0.65rem",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "rgba(245, 245, 245, 0.4)",
  marginTop: 48,
};

export default function Footer() {
  return (
    <footer style={FOOTER_STYLE}>
      <Reveal>
        <div style={CTA_BLOCK_STYLE}>
          <h2 style={TITLE_STYLE}>¿Hablamos?</h2>
          <p style={BODY_STYLE}>
            Trabajando en backend, IoT e IA aplicada — escríbeme.
          </p>
          <div>
            <TechButton href="mailto:grillete07@gmail.com">Contrátame</TechButton>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="footer-links" style={LINKS_ROW_STYLE}>
          <a
            href="https://www.linkedin.com/in/guillermo-sanchez-gutierrez/"
            target="_blank"
            rel="noopener noreferrer"
            style={LINK_STYLE}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#ff3b30")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#f5f5f5")}
          >
            LinkedIn
          </a>
          <a
            href="https://github.com/grilletee"
            target="_blank"
            rel="noopener noreferrer"
            style={LINK_STYLE}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#ff3b30")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#f5f5f5")}
          >
            GitHub
          </a>
          <a
            href="/cv.pdf"
            download
            style={LINK_STYLE}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#ff3b30")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#f5f5f5")}
          >
            Descargar CV
          </a>
        </div>
        <p style={FOOTER_NOTE_STYLE}>Guillermo Sánchez Gutiérrez — 2026</p>
      </Reveal>
    </footer>
  );
}
