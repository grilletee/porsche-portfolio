"use client";

import dynamic from "next/dynamic";

// El Canvas de R3F usa APIs de navegador (WebGL) que no existen en el
// servidor. Cargarlo con ssr:false evita errores de hidratación.
const Scene = dynamic(() => import("@/components/canvas/Scene"), {
  ssr: false,
});

export default function Home() {
  return (
    <main style={{ width: "100vw", height: "100vh", background: "#050505" }}>
      <Scene />
    </main>
  );
}
