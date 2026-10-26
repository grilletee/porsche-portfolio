"use client";

import { useState } from "react";
import { OUTLINE_BUTTON_STYLE } from "./sectionStyles";

interface TechButtonProps {
  href: string;
  children: React.ReactNode;
  /** Si es true, añade el atributo download (descarga local). */
  download?: boolean;
}

/**
 * Botón/link técnico de contorno fino (esquinas casi rectas), con
 * hover de relleno sutil rojo — coherente con la estética del resto.
 */
export default function TechButton({
  href,
  children,
  download,
}: TechButtonProps) {
  const [hovered, setHovered] = useState(false);
  // Solo los enlaces http(s) externos abren pestaña nueva (no mailto ni /cv.pdf).
  const external = /^https?:/.test(href);

  return (
    <a
      href={href}
      download={download}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      style={{
        ...OUTLINE_BUTTON_STYLE,
        background: hovered ? "rgba(255, 59, 48, 0.12)" : "transparent",
        borderColor: hovered ? "#ff3b30" : "rgba(245, 245, 245, 0.4)",
        color: hovered ? "#ff3b30" : "#f5f5f5",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </a>
  );
}
