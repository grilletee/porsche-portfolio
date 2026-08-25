"use client";

import Reveal from "./Reveal";
import TechButton from "./TechButton";
import {
  BODY_STYLE,
  LABEL_STYLE,
  SECTION_PADDING,
  TITLE_STYLE,
} from "./sectionStyles";

// ---------------------------------------------------------------------------
// Contenido (Sprint 8B): ampliación de la fase "ia" del recorrido 3D.
// ---------------------------------------------------------------------------
const PROJECTS = [
  {
    title: "TCG Agent",
    description:
      "Agente de IA autónomo por línea de comandos con memoria RAG (embeddings con sentence-transformers en base de datos vectorial), conectado a la API de Groq, búsqueda web en vivo vía DuckDuckGo, y modelos de lenguaje locales como Llama 3.2 3B Instruct.",
    href: "https://github.com/grilletee/pokemon-tcg-ai-agent",
  },
  {
    title: "CV Analyzer API",
    description:
      "API de análisis inteligente de currículums construida en Python 3.13 con FastAPI, usando Google Gemini 2.5 Flash, validación con Pydantic v2 y procesamiento de PDF con pypdf. Autenticación vía API Key, CI/CD automático con GitHub y Render.",
    href: "https://github.com/grilletee/cv-analyzer",
  },
];

const PROJECT_TITLE_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
  fontWeight: 700,
  fontSize: "clamp(1.25rem, 2vw, 1.5rem)",
  color: "#f5f5f5",
  letterSpacing: "-0.02em",
  margin: 0,
};

const PROJECT_BLOCK_STYLE: React.CSSProperties = {
  borderLeft: "2px solid rgba(255, 59, 48, 0.6)",
  paddingLeft: 24,
  marginTop: 40,
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

export default function AISection() {
  return (
    <section id="ia" style={{ background: "#050505" }}>
      <div style={SECTION_PADDING}>
        <Reveal>
          <p style={LABEL_STYLE}>INTELIGENCIA ARTIFICIAL</p>
          <h2 style={TITLE_STYLE}>Agentes e IA Aplicada</h2>
        </Reveal>

        {PROJECTS.map((project, i) => (
          <Reveal key={project.title} delay={0.1 + i * 0.1}>
            <div style={PROJECT_BLOCK_STYLE}>
              <h3 style={PROJECT_TITLE_STYLE}>{project.title}</h3>
              <p style={{ ...BODY_STYLE, maxWidth: "60ch" }}>{project.description}</p>
              <div>
                <TechButton href={project.href}>Ver repositorio</TechButton>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
