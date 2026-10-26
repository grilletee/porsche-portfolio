"use client";

import Reveal from "./Reveal";
import TechCard from "./TechCard";
import type { CardLink } from "./TechCard";
import { LABEL_STYLE, SECTION_PADDING, TITLE_STYLE } from "./sectionStyles";

// ---------------------------------------------------------------------------
// Contenido: los dos proyectos de IA tienen su propia sección (AISection).
// Aquí se distingue proyecto individual de proyecto en equipo y se indica
// mi parte solo cuando está documentada (README del repo y CV).
// ---------------------------------------------------------------------------
interface ProjectCard {
  title: string;
  kind: string;
  description: string;
  role?: string;
  tags: string[];
  links: CardLink[];
  note?: string;
}

const PROJECTS: ProjectCard[] = [
  {
    title: "CRM Empresarial Full Stack",
    kind: "Proyecto en equipo",
    description:
      "Proyecto desarrollado en equipo para construir un CRM empresarial con Angular, Spring Boot y MySQL. Mi trabajo se centró principalmente en el desarrollo del backend con Java y Spring Boot, incluyendo la lógica de negocio, la API REST y la autenticación con Spring Security y JWT, trabajando en coordinación con el resto del equipo.",
    tags: ["Java", "Spring Boot", "Angular", "MySQL", "JWT"],
    links: [{ label: "Ver repositorio", href: "https://github.com/Yangsr-png/Proyecto-CRM" }],
  },
  {
    title: "Green Campus",
    kind: "Proyecto en equipo",
    description:
      "Fui uno de los pocos estudiantes seleccionados entre el alumnado de DAM, DAW y ASIR del Instituto Nebrija para participar en este proyecto, en reconocimiento al trabajo demostrado durante mi formación. El equipo desarrolló una solución de IoT con Arduino, sensores y MQTT que alcanzó el 4.º puesto en una competición nacional.",
    role: "diseño e implementación de la parte de Arduino del sistema.",
    tags: ["Arduino", "MQTT", "Node.js", "IoT"],
    links: [],
    note: "El repositorio del equipo no es público.",
  },
  {
    title: "Python Automation Tools",
    kind: "Proyecto individual",
    description:
      "Diez utilidades de línea de comandos con argparse y menú central: organizador de archivos, detector de duplicados por SHA-256, renombrador masivo, optimizador de imágenes, herramientas PDF, copias de seguridad y más.",
    tags: ["Python", "CLI", "Automatización"],
    links: [{ label: "Ver repositorio", href: "https://github.com/grilletee/python-automation-tools" }],
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
          <h2 style={TITLE_STYLE}>Equipo y automatización</h2>
        </Reveal>

        <div style={GRID_STYLE}>
          {PROJECTS.map((project, i) => (
            <TechCard key={project.title} index={i} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
}
