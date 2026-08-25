"use client";

import Reveal from "./Reveal";
import TechButton from "./TechButton";
import {
  BODY_STYLE,
  LABEL_STYLE,
  SECTION_PADDING,
  TAG_STYLE,
  TITLE_STYLE,
} from "./sectionStyles";

// ---------------------------------------------------------------------------
// Contenido (Sprint 8B): grid con TODOS los proyectos del portfolio.
// ---------------------------------------------------------------------------
interface ProjectCard {
  title: string;
  description: string;
  tags: string[];
  href: string;
}

const PROJECTS: ProjectCard[] = [
  {
    title: "CRM Empresarial Full Stack",
    description:
      "Sistema de gestión empresarial con autenticación JWT, roles de usuario y panel de administración. Angular en frontend, Spring Boot en backend, MySQL con JPA/Hibernate.",
    tags: ["Java", "Spring Boot", "Angular", "MySQL", "JWT"],
    href: "https://github.com/Yangsr-png/Proyecto-CRM",
  },
  {
    title: "Green Campus",
    description:
      "Sistema autónomo de sensores IoT para universidades. Top 4 Nacional en Eco-Digithon.",
    tags: ["Arduino", "MQTT", "Node.js", "IoT"],
    href: "https://github.com/GreenCampusNebrija/green-campus-arduino",
  },
  {
    title: "TCG Agent",
    description:
      "Agente de IA autónomo por línea de comandos con memoria RAG, conectado a la API de Groq, búsqueda web en vivo y modelos de lenguaje locales.",
    tags: ["Python", "RAG", "Groq", "LLM"],
    href: "https://github.com/grilletee/pokemon-tcg-ai-agent",
  },
  {
    title: "CV Analyzer API",
    description:
      "API de análisis inteligente de currículums en Python con FastAPI, Google Gemini 2.5 Flash, validación con Pydantic v2 y procesamiento de PDF.",
    tags: ["Python", "FastAPI", "Gemini"],
    href: "https://github.com/grilletee/cv-analyzer",
  },
  {
    title: "Python Automation Tools",
    description: "Colección de herramientas de automatización en Python.",
    tags: ["Python", "Automation"],
    href: "https://github.com/grilletee/python-automation-tools",
  },
];

const GRID_STYLE: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: 24,
  marginTop: 48,
};

const CARD_STYLE: React.CSSProperties = {
  border: "1px solid rgba(245, 245, 245, 0.12)",
  borderRadius: 2,
  padding: 28,
  display: "flex",
  flexDirection: "column",
  gap: 12,
  background: "rgba(255, 255, 255, 0.02)",
  height: "100%",
};

const CARD_TITLE_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
  fontWeight: 700,
  fontSize: "clamp(1.25rem, 2vw, 1.5rem)",
  color: "#f5f5f5",
  letterSpacing: "-0.02em",
  margin: 0,
};

const TAGS_ROW_STYLE: React.CSSProperties = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
};

export default function ProjectsSection() {
  return (
    <section id="proyectos" style={{ background: "#050505" }}>
      <div style={SECTION_PADDING}>
        <Reveal>
          <p style={LABEL_STYLE}>PROYECTOS</p>
          <h2 style={TITLE_STYLE}>Lo que he construido</h2>
        </Reveal>

        <div style={GRID_STYLE}>
          {PROJECTS.map((project, i) => (
            <Reveal key={project.title} delay={(i % 3) * 0.08}>
              <div style={CARD_STYLE}>
                <h3 style={CARD_TITLE_STYLE}>{project.title}</h3>
                <p style={{ ...BODY_STYLE, fontSize: "0.95rem", flex: 1 }}>
                  {project.description}
                </p>
                <div style={TAGS_ROW_STYLE}>
                  {project.tags.map((tag) => (
                    <span key={tag} style={TAG_STYLE}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div>
                  <TechButton href={project.href}>Ver repositorio</TechButton>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
