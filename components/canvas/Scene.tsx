import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import CameraRig from "./CameraRig";
import Lighting from "./Lighting";
import PorscheExploded from "./PorscheExploded";

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [5, 2.2, 6], fov: 40 }}
      style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh" }}
      gl={{ antialias: true }}
    >
      {/* El color de fondo inicial (#050505) se establece aquí.
          Durante el scroll, useBackgroundColor (vía CameraRig) lo
          muta dinámicamente para la transición del Tramo 3. */}
      <color attach="background" args={["#050505"]} />

      <Lighting />

      <Suspense fallback={null}>
        <PorscheExploded position={[0, 0, 0]} />
      </Suspense>

      {/* Sprint 3+4: cámara + fondo controlados por scroll.
          CameraRig monta useCameraAnimation() y useBackgroundColor(). */}
      <CameraRig />
    </Canvas>
  );
}
