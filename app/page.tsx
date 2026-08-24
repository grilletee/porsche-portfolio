"use client";

import dynamic from "next/dynamic";
import { useLenisScroll } from "@/hooks/useLenisScroll";
import { useScrollStore } from "@/store/useScrollStore";

// El Canvas de R3F usa APIs de navegador (WebGL) que no existen en el
// servidor. Cargarlo con ssr:false evita errores de hidratación.
const Scene = dynamic(() => import("@/components/canvas/Scene"), {
  ssr: false,
});

export default function Home() {
  useLenisScroll();
  const scrollProgress = useScrollStore((s) => s.scrollProgress);

  return (
    <main>
      {/* Canvas 3D: position fixed, cubre toda la pantalla (ver Scene.tsx). */}
      <Scene />

      {/* Contenido scrollable: genera 500vh de recorrido para verificar
          que Lenis + ScrollTrigger + el store de progreso funcionan.
          pointer-events: none para que OrbitControls (debug) siga
          recibiendo eventos de ratón a través de esta capa. */}
      <div style={{ position: "relative", zIndex: 1, pointerEvents: "none" }}>
        <div style={{ height: "500vh" }}>
          {/* Bloques de debug cada 100vh — se quitan en el Sprint 3. */}
          {[0, 1, 2, 3, 4].map((i) => (
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

      {/* Debug overlay: valor de scrollProgress en tiempo real.
          Se quita cuando se confirme que el scroll funciona. */}
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
        }}
      >
        scroll: {(scrollProgress * 100).toFixed(1)}%
      </div>
    </main>
  );
}
