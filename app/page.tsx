"use client";

import dynamic from "next/dynamic";
import { useLenisScroll } from "@/hooks/useLenisScroll";
import { useScrollStore } from "@/store/useScrollStore";
import { useExplodedView } from "@/hooks/useExplodedView";
import ContentOverlay from "@/components/ui/ContentOverlay";
import AISection from "@/components/ui/AISection";
import ProjectsSection from "@/components/ui/ProjectsSection";

// El Canvas de R3F usa APIs de navegador (WebGL) que no existen en el
// servidor. Cargarlo con ssr:false evita errores de hidratación.
const Scene = dynamic(() => import("@/components/canvas/Scene"), {
  ssr: false,
});

/** Panel de debug: muestra scrollProgress y explodeFactor en tiempo real. */
function DebugPanel() {
  const scrollProgress = useScrollStore((s) => s.scrollProgress);
  const explodeFactor = useExplodedView();

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 100,
        background: "rgba(0,0,0,0.75)",
        color: "#0f0",
        fontFamily: "monospace",
        fontSize: 14,
        padding: "8px 14px",
        borderRadius: 6,
        border: "1px solid #0f0",
        pointerEvents: "auto",
        lineHeight: 1.6,
      }}
    >
      <div>scroll: {(scrollProgress * 100).toFixed(1)}%</div>
      <div>explode: {(explodeFactor * 100).toFixed(1)}%</div>
    </div>
  );
}

export default function Home() {
  useLenisScroll();

  return (
    <main>
      {/* Recorrido 3D: contenedor de 700vh exactos (id usado por
          lib/scrollTrack.ts para medir el progreso). El Canvas es
          position: sticky — se pega a la pantalla mientras se scrollea
          dentro de este contenedor y se libera al superarlo, dejando
          paso a las secciones HTML de abajo. */}
      <div
        id="scroll-track"
        style={{ position: "relative", height: "700vh" }}
      >
        {/* Canvas 3D (sticky, ver Scene.tsx). */}
        <Scene />

        {/* Bloques de debug cada 100vh — referencia visual, se
            quitan cuando el contenido esté listo. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              style={{
                height: "100vh",
                borderBottom: "1px dashed rgba(255,255,255,0.1)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Debug overlay: valores en tiempo real.
          Se quita cuando se confirme que todo funciona. */}
      <DebugPanel />

      {/* Overlay 3D: textos sincronizados con las fases de cámara
          (usa scrollPhases.ts como fuente única). */}
      <ContentOverlay />

      {/* Secciones HTML posteriores — scroll normal, no ligadas a
          scrollProgress (Sprint 8B). */}
      <AISection />
      <ProjectsSection />
    </main>
  );
}
