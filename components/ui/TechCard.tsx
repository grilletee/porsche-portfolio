"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import TechButton from "./TechButton";
import { BODY_STYLE, TAG_STYLE } from "./sectionStyles";

export interface CardLink {
  label: string;
  href: string;
}

interface TechCardProps {
  /** Índice 0-based dentro de su sección (label numerado + stagger). */
  index: number;
  title: string;
  description: string;
  tags?: string[];
  /** Enlaces de acción (repositorio, demo...). Vacío = sin botones. */
  links?: CardLink[];
  /** "Proyecto individual" / "Proyecto en equipo": se muestra en el label. */
  kind?: string;
  /** Mi contribución concreta (línea destacada bajo la descripción). */
  role?: string;
  /** Nota bajo los botones (p. ej. repositorio no público). */
  note?: string;
  /** Descripción más ancha (secciones de una sola columna). */
  wide?: boolean;
}

/**
 * Tarjeta de proyecto con la misma dirección de arte que el recorrido
 * 3D: label numerado en JetBrains Mono + rojo de acento, borde fino
 * sutil, hover con borde rojo y fondo ligeramente más brillante, y
 * entrada con gsap (expo.out) al entrar en viewport con stagger.
 * Con prefers-reduced-motion la clase motion-reveal fuerza el estado
 * final (ver globals.css).
 */
export default function TechCard({
  index,
  title,
  description,
  tags,
  links = [],
  kind,
  role,
  note,
  wide = false,
}: TechCardProps) {
  const ref = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.set(el, { opacity: 0, y: 30 });

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          obs.disconnect();
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: "expo.out",
            delay: index * 0.1,
          });
        }
      },
      { threshold: 0.15 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  const descriptionStyle: React.CSSProperties = {
    ...BODY_STYLE,
    fontSize: "0.95rem",
    flex: 1,
    ...(wide ? { maxWidth: "60ch", flex: undefined } : {}),
  };

  const number = String(index + 1).padStart(2, "0");

  return (
    <article
      ref={ref}
      className="motion-reveal"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: 2,
        padding: 28,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        height: "100%",
        opacity: 0,
        transition: "border-color 0.3s ease, background 0.3s ease",
        borderColor: hovered ? "rgba(255, 59, 48, 0.7)" : undefined,
        background: hovered ? "rgba(255, 255, 255, 0.03)" : undefined,
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: "0.7rem",
          fontWeight: 500,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "#ff3b30",
          margin: 0,
        }}
      >
        {kind ? `${number} — ${kind}` : number}
      </p>

      <h3
        style={{
          fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
          fontWeight: 700,
          fontSize: "clamp(1.25rem, 2vw, 1.5rem)",
          color: "#f5f5f5",
          letterSpacing: "-0.02em",
          margin: 0,
        }}
      >
        {title}
      </h3>

      <p style={descriptionStyle}>{description}</p>

      {role && (
        <p style={{ ...BODY_STYLE, fontSize: "0.9rem", color: "#f5f5f5" }}>
          <strong style={{ color: "#ff3b30", fontWeight: 500 }}>Mi parte: </strong>
          {role}
        </p>
      )}

      {tags && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {tags.map((tag) => (
            <span key={tag} style={TAG_STYLE}>
              {tag}
            </span>
          ))}
        </div>
      )}

      {links.length > 0 && (
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {links.map((link) => (
            <TechButton key={link.href} href={link.href}>
              {link.label}
              <span className="sr-only"> de {title}</span>
            </TechButton>
          ))}
        </div>
      )}

      {note && (
        <p style={{ ...BODY_STYLE, fontSize: "0.8rem", color: "rgba(245, 245, 245, 0.7)" }}>
          {note}
        </p>
      )}
    </article>
  );
}
