"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useCameraAnimation } from "@/hooks/useCameraAnimation";
import { useBackgroundColor } from "@/hooks/useBackgroundColor";
import { useQualityStore } from "@/store/useQualityStore";

/**
 * Luz puntual que sigue a la cámara en cada frame.
 * Simula una luz de acompañamiento tipo "linterna de fotógrafo de
 * producto", iluminando lo que la cámara mira — crítico para que
 * las piezas explosionadas no caigan en zonas sin cobertura.
 * Sprint 11A: en tier 'low' reduce intensity y distance a la mitad
 * (el resto de la iluminación directa se mantiene).
 */
function CameraLight() {
  const lightRef = useRef<THREE.PointLight>(null);
  const qualityTier = useQualityStore((s) => s.qualityTier);

  useFrame(({ camera }) => {
    if (lightRef.current) {
      lightRef.current.position.copy(camera.position);
    }
  });

  const low = qualityTier === "low";
  return (
    <pointLight
      ref={lightRef}
      intensity={low ? 0.55 : 1.1}
      distance={low ? 2.5 : 5}
      color="#ffffff"
      castShadow={false}
    />
  );
}

/**
 * Componente que monta los hooks y la luz de acompañamiento.
 * - useCameraAnimation: coreografía de cámara (expo.inOut).
 * - useBackgroundColor: transición suave de fondo (sine.inOut).
 * - CameraLight: pointLight que sigue a la cámara.
 */
export default function CameraRig() {
  useCameraAnimation();
  useBackgroundColor();
  return <CameraLight />;
}