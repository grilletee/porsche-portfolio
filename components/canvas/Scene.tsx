"use client";

import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { useQualityStore } from "@/store/useQualityStore";
import CameraRig from "./CameraRig";
import Lighting from "./Lighting";
import PorscheExploded from "./PorscheExploded";

export default function Scene() {
  const qualityTier = useQualityStore((s) => s.qualityTier);
  const setQualityTier = useQualityStore((s) => s.setQualityTier);

  // Conteo de ventanas sostenidas (Sprint 11A): onDecline/onIncline se
  // disparan en cada ventana de muestreo mientras el rendimiento se
  // mantiene bajo/alto. Contamos ventanas consecutivas para dar un
  // margen de tolerancia y no bajar de tier por un frame lento puntual.
  const declineStreak = useRef(0);
  const inclineStreak = useRef(0);

  const handleDecline = () => {
    declineStreak.current += 1;
    inclineStreak.current = 0;
    // 3 ventanas seguidas por debajo del umbral (cada una ~250ms de
    // muestreo) => rendimiento realmente bajo => tier 'low'.
    if (declineStreak.current >= 3) setQualityTier("low");
    else setQualityTier("medium");
  };

  const handleIncline = () => {
    inclineStreak.current += 1;
    declineStreak.current = 0;
    // 2 ventanas seguidas por encima del umbral => recuperación => 'high'.
    if (inclineStreak.current >= 2) setQualityTier("high");
  };

  return (
    <Canvas
      dpr={qualityTier === "high" ? [1, 1.5] : 1}
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
        // Altura en clase CSS (canvas-height): 100dvh con fallback a
        // 100vh (Sprint 11C).
      }}
      className="canvas-height"
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
          el coste sin perder calidad perceptible en los reflejos.
          Sprint 11A: 'low' lo desactiva por completo (los materiales
          pierden algo de reflejo pero las luces directas se
          mantienen); 'medium' baja la resolución a 32. */}
      {qualityTier !== "low" && (
        <Environment
          preset="studio"
          background={false}
          environmentIntensity={0.3}
          resolution={qualityTier === "high" ? 64 : 32}
        />
      )}

      <Lighting />

      <Suspense fallback={null}>
        <PorscheExploded position={[0, 0, 0]} />
      </Suspense>

      {/* CameraRig: cámara + fondo + luz de acompañamiento (CameraLight). */}
      <CameraRig />

      {/* Bloom sutil: threshold alto para que solo brillen los highlights
          más intensos (cromados, bordes metálicos), no toda la imagen.
          Sprint 11A: solo en 'high' — es el efecto más caro. */}
      {qualityTier === "high" && (
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.92}
            luminanceSmoothing={0.3}
            intensity={0.15}
          />
        </EffectComposer>
      )}

      {/* Monitor de rendimiento (Sprint 11A): mide el frame rate REAL
          y dispara onDecline/onIncline cuando el rendimiento se
          mantiene bajo/alto de forma sostenida (threshold 0.75 = el
          75% de las muestras). Con flipflops en su default (Infinity)
          onFallback nunca se activa: la medición no se vuelve
          permanente y el tier puede subir de nuevo al recuperarse. */}
      <PerformanceMonitor
        threshold={0.75}
        onDecline={handleDecline}
        onIncline={handleIncline}
      />
    </Canvas>
  );
}
