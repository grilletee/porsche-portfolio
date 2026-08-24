"use client";

import { useCameraAnimation } from "@/hooks/useCameraAnimation";
import { useBackgroundColor } from "@/hooks/useBackgroundColor";

/**
 * Componente que monta los hooks de animación dentro del Canvas.
 * - useCameraAnimation: coreografía de cámara con easing expo.inOut.
 * - useBackgroundColor: transición suave de fondo con sine.inOut.
 */
export default function CameraRig() {
  useCameraAnimation();
  useBackgroundColor();
  return null;
}