"use client";

import dynamic from "next/dynamic";
import { useLenisScroll } from "@/hooks/useLenisScroll";
import ContentOverlay from "@/components/ui/ContentOverlay";
import Loader from "@/components/ui/Loader";
import AISection from "@/components/ui/AISection";
import ProjectsSection from "@/components/ui/ProjectsSection";
import Footer from "@/components/ui/Footer";
import ScrollCue from "@/components/ui/ScrollCue";

// El Canvas de R3F usa APIs de navegador (WebGL) que no existen en el
// servidor. Cargarlo con ssr:false evita errores de hidratación.
const Scene = dynamic(() => import("@/components/canvas/Scene"), {
  ssr: false,
});

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
        className="track-height"
        style={{ position: "relative" }}
      >
        {/* Canvas 3D (sticky, ver Scene.tsx). */}
        <Scene />

        {/* Loader de carga del modelo (Sprint 12B): overlay fixed con
            el progreso real del .glb; se desmonta del DOM al terminar. */}
        <Loader />
        <ScrollCue />
      </div>

      {/* Overlay 3D: textos sincronizados con las fases de cámara
          (usa scrollPhases.ts como fuente única). */}
      <ContentOverlay />

      {/* Secciones HTML posteriores — scroll normal, no ligadas a
          scrollProgress (Sprint 8B / 8C). */}
      <AISection />
      <ProjectsSection />
      <Footer />
    </main>
  );
}
