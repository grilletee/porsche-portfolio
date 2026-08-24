import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Lighting from "./Lighting";
import { Model as Porsche } from "./Porsche";
export default function Scene() {
  return (
    <Canvas
      camera={{ position: [5, 2.2, 6], fov: 40 }}
      style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh" }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#050505"]} />

      <Lighting />

      <Suspense fallback={null}>
        <Porsche position={[0, 0, 0]} />
      </Suspense>

      {/* Temporal, solo para inspeccionar el modelo durante el desarrollo.
          Se elimina en el sprint de coreografía de cámara (Sprint 3),
          cuando la cámara pasa a moverse por curvas ligadas al scroll. */}
      <OrbitControls enableDamping dampingFactor={0.05} />
    </Canvas>
  );
}
