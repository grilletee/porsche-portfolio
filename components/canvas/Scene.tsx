import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import CameraRig from "./CameraRig";
import Lighting from "./Lighting";
import { Model as Porsche } from "./Porsche";

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [5, 2.2, 6], fov: 40 }}
      style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh" }}
      gl={{ antialias: true }}
    >
      {/* El color de fondo inicial (#050505) se establece aquí.
          Durante el scroll, useCameraAnimation (vía CameraRig) lo
          muta dinámicamente para el flash del Tramo 3. */}
      <color attach="background" args={["#050505"]} />

      <Lighting />

      <Suspense fallback={null}>
        <Porsche position={[0, 0, 0]} />
      </Suspense>

      {/* Sprint 3: cámara controlada por scroll.
          CameraRig monta useCameraAnimation() que en cada useFrame
          lee scrollProgress del store, determina el tramo activo,
          aplica easing expo.inOut, e interpola posición + lookAt. */}
      <CameraRig />
    </Canvas>
  );
}
