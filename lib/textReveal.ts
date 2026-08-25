/**
 * Funciones puras para calcular el estado de revelado de texto
 * como función continua de scrollProgress.
 *
 * A diferencia del enfoque por eventos (useEffect + gsap.fromTo al
 * cambiar de fase), este módulo trata el revelado como una función
 * matemática del scroll: misma entrada → misma salida, idéntica
 * hacia adelante y hacia atrás.
 *
 * Sprint 6 (holdFraction): la ventana de revelado se ancla al "hold"
 * de la cámara — la porción final del rango donde la cámara ya llegó
 * a su destino. Si la fase no tiene holdFraction, se usa la ventana
 * clásica 25%-50%-25%.
 */

import { gsap } from "gsap";

export interface RevealState {
  /** 0 = invisible, 1 = completamente visible */
  opacity: number;
  /** Desplazamiento vertical en px (positivo = abajo, negativo = arriba) */
  translateY: number;
}

export interface PhaseRange {
  start: number;
  end: number;
  /** Fracción final del rango donde la cámara ya está asentada. */
  holdFraction?: number;
}

/** Easings cacheados una sola vez. */
const _easeOut = gsap.parseEase("expo.out");
const _easeIn = gsap.parseEase("expo.in");

/** Ancho del sub-tramo de entrada/salida dentro del hold (en progreso local). */
const HOLD_ANIM_WIDTH = 0.08;

/**
 * Calcula el estado de revelado para una fase dada.
 *
 * Con holdFraction:
 *   holdStart = 1 - holdFraction
 *   local < holdStart          → invisible (cámara en tránsito)
 *   local ∈ [holdStart, holdStart + HOLD_ANIM_WIDTH]   → entrada expo.out
 *   local ∈ [holdStart + HOLD_ANIM_WIDTH, 1 - HOLD_ANIM_WIDTH] → visible
 *   local ∈ [1 - HOLD_ANIM_WIDTH, 1]                   → salida expo.in
 *
 * Sin holdFraction: ventana clásica 25%-50%-25% sobre todo el rango.
 */
export function getTextRevealState(
  scrollProgress: number,
  phase: PhaseRange,
): RevealState {
  const range = phase.end - phase.start;
  if (range <= 0) return { opacity: 0, translateY: 20 };

  const local = Math.max(
    0,
    Math.min(1, (scrollProgress - phase.start) / range),
  );

  const holdFraction = phase.holdFraction ?? 0;

  if (holdFraction > 0) {
    // --- Modo hold: la ventana de texto está anclada al hold de cámara ---
    const holdStart = 1 - holdFraction;

    // Antes del hold: cámara en tránsito, texto invisible.
    if (local < holdStart) {
      return { opacity: 0, translateY: 20 };
    }

    // Normalizar posición dentro del hold (0 al inicio del hold, 1 al final).
    const holdProgress = (local - holdStart) / holdFraction;

    if (holdProgress < HOLD_ANIM_WIDTH) {
      // Entrada dentro del hold.
      const t = _easeOut(holdProgress / HOLD_ANIM_WIDTH);
      return { opacity: t, translateY: 20 * (1 - t) };
    }

    if (holdProgress > 1 - HOLD_ANIM_WIDTH) {
      // Salida al final del hold.
      const t = _easeIn((holdProgress - (1 - HOLD_ANIM_WIDTH)) / HOLD_ANIM_WIDTH);
      return { opacity: 1 - t, translateY: -20 * t };
    }

    // Completamente visible durante el centro del hold.
    return { opacity: 1, translateY: 0 };
  }

  // --- Modo clásico: ventana 25%-50%-25% (fases sin holdFraction) ---
  if (local < 0.25) {
    const t = _easeOut(local / 0.25);
    return { opacity: t, translateY: 20 * (1 - t) };
  }

  if (local > 0.75) {
    const t = _easeIn((local - 0.75) / 0.25);
    return { opacity: 1 - t, translateY: -20 * t };
  }

  return { opacity: 1, translateY: 0 };
}

/**
 * Versión con offset: aplica un desplazamiento sobre scrollProgress
 * para crear stagger entre sub-elementos (label → acento → título → cuerpo).
 */
export function getTextRevealStateStaggered(
  scrollProgress: number,
  phase: PhaseRange,
  staggerOffset: number,
): RevealState {
  return getTextRevealState(scrollProgress - staggerOffset, phase);
}