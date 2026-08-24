"use client";

import { useCameraAnimation } from "@/hooks/useCameraAnimation";

/**
 * Componente vacío que monta el hook de animación de cámara dentro
 * del Canvas de R3F. Necesita estar dentro del árbol del Canvas
 * porque useCameraAnimation usa useThree() y useFrame().
 */
export default function CameraRig() {
  useCameraAnimation();
  return null;
}