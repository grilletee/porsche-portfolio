"use client";

import Reveal from "./Reveal";
import TechCard from "./TechCard";
import { LABEL_STYLE, SECTION_PADDING, TITLE_STYLE } from "./sectionStyles";

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

const PROJECTS_LIST_STYLE: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 24,
  marginTop: 48,
};

export default function AISection() {
  return (
    <section id="ia" style={{ background: "#050505" }}>
      <div style={SECTION_PADDING}>
        <Reveal>
          <p style={LABEL_STYLE}>INTELIGENCIA ARTIFICIAL</p>
          <h2 style={TITLE_STYLE}>Agentes e IA Aplicada</h2>
        </Reveal>

        <div style={PROJECTS_LIST_STYLE}>
          {PROJECTS.map((project, i) => (
            <TechCard
              key={project.title}
              index={i}
              title={project.title}
              description={project.description}
              href={project.href}
              wide
            />
          ))}
        </div>
      </div>
    </section>
  );
}
