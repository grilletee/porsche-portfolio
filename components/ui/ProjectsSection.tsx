"use client";

import Reveal from "./Reveal";
import TechCard from "./TechCard";
import { LABEL_STYLE, SECTION_PADDING, TITLE_STYLE } from "./sectionStyles";

// ---------------------------------------------------------------------------
// Contenido (Sprint 11C): TCG Agent y CV Analyzer tienen su propia
// sección dedicada (AISection) — el grid queda con 3 proyectos.
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
    title: "Python Automation Tools",
    description: "Colección de herramientas de automatización en Python.",
    tags: ["Python", "Automation"],
    href: "https://github.com/grilletee/python-automation-tools",
  },
];

// Grid pensado para 3 tarjetas: 3 columnas en desktop, 2 en tablet,
// 1 en móvil (auto-fit con min-width responsive).
const GRID_STYLE: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: 24,
  marginTop: 48,
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
            <TechCard
              key={project.title}
              index={i}
              title={project.title}
              description={project.description}
              tags={project.tags}
              href={project.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
