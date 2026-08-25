import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import CameraRig from "./CameraRig";
import Lighting from "./Lighting";
import PorscheExploded from "./PorscheExploded";

export default function Scene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [5, 2.2, 6], fov: 40 }}
      style={{
        // Sprint 8: sticky en vez de fixed — el Canvas se queda pegado
        // a la pantalla mientras se scrollea dentro del contenedor
        // #scroll-track (700vh) y se libera al superarlo, dejando paso
        // a las secciones HTML posteriores.
        position: "sticky",
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

      {/* Environment map de studio a baja resolución: solo aporta
          reflejos metálicos (background=false). resolution=64 reduce
          el coste sin perder calidad perceptible en los reflejos. */}
      <Environment
        preset="studio"
        background={false}
        environmentIntensity={0.3}
        resolution={64}
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

      {/* Monitor de rendimiento: reduce el dpr si el frame rate cae
          por debajo del umbral (por defecto ~30fps).
          En drei reciente, sin callbacks propios, el componente
          llama automáticamente a gl.setDpr() para adaptarse. */}
      <PerformanceMonitor />
    </Canvas>
  );
}