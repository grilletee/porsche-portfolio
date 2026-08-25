"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useCameraAnimation } from "@/hooks/useCameraAnimation";
import { useBackgroundColor } from "@/hooks/useBackgroundColor";

/**
 * Luz puntual que sigue a la cámara en cada frame.
 * Simula una luz de acompañamiento tipo "linterna de fotógrafo de
 * producto", iluminando lo que la cámara mira — crítico para que
 * las piezas explosionadas no caigan en zonas sin cobertura.
 */
function CameraLight() {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ camera }) => {
    if (lightRef.current) {
      lightRef.current.position.copy(camera.position);
    }
  });

  return (
    <pointLight
      ref={lightRef}
      intensity={1.1}
      distance={5}
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