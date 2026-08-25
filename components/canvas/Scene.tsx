import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import CameraRig from "./CameraRig";
import Lighting from "./Lighting";
import PorscheExploded from "./PorscheExploded";

export default function Scene() {
  return (
    <Canvas
      camera={{ position: [5, 2.2, 6], fov: 40 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
      }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.85,
      }}
    >
      {/* Color de fondo inicial (mutado dinámicamente por useBackgroundColor). */}
      <color attach="background" args={["#050505"]} />

      {/* Environment map de estudio: solo aporta reflejos metálicos
          (background=false), no reemplaza el fondo negro. */}
      <Environment
        preset="studio"
        background={false}
        environmentIntensity={0.3}
      />

      <Lighting />

      <Suspense fallback={null}>
        <PorscheExploded position={[0, 0, 0]} />
      </Suspense>

      {/* CameraRig: cámara + fondo + luz de acompañamiento (CameraLight). */}
      <CameraRig />

      {/* Bloom sutil: threshold alto para que solo brillen los highlights
          más intensos (cromados, bordes metálicos), no toda la imagen. */}
      <EffectComposer>
        <Bloom
          luminanceThreshold={0.92}
          luminanceSmoothing={0.3}
          intensity={0.15}
        />
      </EffectComposer>
    </Canvas>
  );
}