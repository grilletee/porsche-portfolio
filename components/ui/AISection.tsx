"use client";

import Reveal from "./Reveal";
import TechCard from "./TechCard";
import type { CardLink } from "./TechCard";
import { LABEL_STYLE, SECTION_PADDING, TITLE_STYLE } from "./sectionStyles";

// ---------------------------------------------------------------------------
// Contenido: descripciones contrastadas con los README de cada repositorio
// (auditoría). Ambos son proyectos individuales (un único contribuidor).
// ---------------------------------------------------------------------------
interface AIProject {
  title: string;
  kind: string;
  description: string;
  tags: string[];
  links: CardLink[];
  note?: string;
}

const PROJECTS: AIProject[] = [
  {
    title: "Agente de IA con herramientas y memoria RAG",
    kind: "Proyecto individual",
    description:
      "Agente de IA basado en Gemini 2.5 Flash que combina tool calling con herramientas externas (una API de datos y búsqueda web), recuperación contextual mediante RAG con ChromaDB y sentence-transformers, y una API REST desarrollada con FastAPI. Un bucle de hasta cinco rondas permite al modelo invocar las herramientas necesarias antes de responder, con sesiones independientes y reintentos con backoff ante errores del servicio.",
    tags: ["Python", "FastAPI", "Gemini", "Tool calling", "RAG", "ChromaDB"],
    links: [
      { label: "Ver repositorio", href: "https://github.com/grilletee/pokemon-tcg-ai-agent" },
    ],
  },
  {
    title: "CV Analyzer API",
    kind: "Proyecto individual",
    description:
      "API REST que analiza currículums (texto o PDF) con Google Gemini 2.5 Flash y los compara con una oferta de trabajo, devolviendo JSON validado con Pydantic v2. Autenticación por API Key, tests con pytest sin consumir la API y despliegue continuo en Render.",
    tags: ["Python 3.13", "FastAPI", "Gemini", "Pydantic", "pytest"],
    links: [
      { label: "Ver repositorio", href: "https://github.com/grilletee/cv-analyzer" },
      { label: "Documentación API", href: "https://cv-analyzer-37jx.onrender.com/docs" },
    ],
    note: "La demo está en el plan gratuito de Render: la primera petición puede tardar ~50 s en despertar.",
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
          <h2 style={TITLE_STYLE}>Proyectos de IA</h2>
        </Reveal>

        <div style={PROJECTS_LIST_STYLE}>
          {PROJECTS.map((project, i) => (
            <TechCard key={project.title} index={i} wide {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}
