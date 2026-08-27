import type { CSSProperties } from "react";

/**
 * Estilos compartidos por las secciones HTML posteriores al recorrido
 * 3D (AISection, ProjectsSection, Footer). Misma dirección de arte que
 * ContentOverlay: Space Grotesk en títulos, JetBrains Mono en
 * labels/tags, system-ui en cuerpo, acento #ff3b30.
 */

export const SECTION_PADDING: CSSProperties = {
  padding: "16vh 8vw",
  maxWidth: 1200,
  margin: "0 auto",
};

export const LABEL_STYLE: CSSProperties = {
  fontFamily: "var(--font-jetbrains-mono), monospace",
  fontSize: "0.75rem",
  fontWeight: 500,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "#ff3b30",
  margin: 0,
};

export const TITLE_STYLE: CSSProperties = {
  fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
  fontWeight: 700,
  fontSize: "clamp(2rem, 4vw, 3.5rem)",
  letterSpacing: "-0.02em",
  color: "#f5f5f5",
  lineHeight: 1.1,
  margin: "0.75rem 0 0",
};

export const BODY_STYLE: CSSProperties = {
  fontFamily: "system-ui",
  fontWeight: 400,
  fontSize: "clamp(1rem, 1.3vw, 1.15rem)",
  color: "rgba(245, 245, 245, 0.75)",
  lineHeight: 1.6,
  margin: 0,
};

export const TAG_STYLE: CSSProperties = {
  fontFamily: "var(--font-jetbrains-mono), monospace",
  border: "1px solid rgba(255, 59, 48, 0.6)",
  color: "rgba(255, 59, 48, 0.6)",
  fontSize: "0.7rem",
  fontWeight: 500,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  padding: "4px 10px",
  borderRadius: 2,
};

export const OUTLINE_BUTTON_STYLE: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "var(--font-jetbrains-mono), monospace",
  fontSize: "0.75rem",
  fontWeight: 500,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  color: "#f5f5f5",
  border: "1px solid rgba(245, 245, 245, 0.4)",
  background: "transparent",
  padding: "10px 18px",
  // Sprint 12E: área de toque mínima de accesibilidad táctil (44px)
  // en móvil — con 0.75rem de texto + padding 10px quedaba en ~36px.
  minHeight: 44,
  borderRadius: 2,
  textDecoration: "none",
  transition: "background 0.2s, color 0.2s, border-color 0.2s",
  cursor: "pointer",
};
