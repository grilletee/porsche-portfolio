"use client";

import dynamic from "next/dynamic";
import { useLenisScroll } from "@/hooks/useLenisScroll";
import { useScrollStore } from "@/store/useScrollStore";
import { useExplodedView } from "@/hooks/useExplodedView";
import ContentOverlay from "@/components/ui/ContentOverlay";

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
      {/* Canvas 3D: position fixed, cubre toda la pantalla (ver Scene.tsx). */}
      <Scene />

      {/* Contenido scrollable: 700vh de recorrido para la coreografía.
          pointer-events: none para que no bloquee los eventos — en
          el Sprint 5 se activará cuando añadamos overlays de contenido. */}
      <div style={{ position: "relative", zIndex: 1, pointerEvents: "none" }}>
        <div style={{ height: "700vh" }}>
          {/* Bloques de debug cada 100vh — referencia visual, se
              quitan cuando el contenido esté listo. */}
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

      {/* Sprint 5: overlays de texto sincronizados con las fases
          de cámara (usa scrollPhases.ts como fuente única). */}
      <ContentOverlay />
    </main>
  );
}
