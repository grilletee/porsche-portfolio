/**
 * Funciones puras para calcular el estado de revelado de texto
 * como función continua de scrollProgress.
 *
 * A diferencia del enfoque por eventos (useEffect + gsap.fromTo al
 * cambiar de fase), este módulo trata el revelado como una función
 * matemática del scroll: misma entrada → misma salida, idéntica
 * hacia adelante y hacia atrás.
 *
 * Ventana de revelado por fase:
 * - Primer 25% del rango local: entrada (expo.out)
 * - 25%–75%: completamente visible
 * - Último 25%: salida (expo.in, dirección opuesta)
 */

import { gsap } from "gsap";

export interface RevealState {
  /** 0 = invisible, 1 = completamente visible */
  opacity: number;
  /** Desplazamiento vertical en px (positivo = abajo, negativo = arriba) */
  translateY: number;
}

/** Easings cacheados una sola vez. */
const _easeOut = gsap.parseEase("expo.out");
const _easeIn = gsap.parseEase("expo.in");

/**
 * Calcula el estado de revelado para una fase dada.
 *
 * @param scrollProgress - progreso global de scroll (0-1)
 * @param phase - rango [start, end] de la fase en scrollProgress
 * @returns opacity (0-1) y translateY (px)
 */
export function getTextRevealState(
  scrollProgress: number,
  phase: { start: number; end: number },
): RevealState {
  const range = phase.end - phase.start;
  if (range <= 0) return { opacity: 0, translateY: 20 };

  // Progreso local dentro de la fase, clampado a [0, 1].
  const local = Math.max(0, Math.min(1, (scrollProgress - phase.start) / range));

  if (local < 0.25) {
    // --- ENTRADA: del 0% al 25% del rango de la fase ---
    // Normalizar a 0-1 dentro del tramo de entrada, aplicar expo.out.
    const t = _easeOut(local / 0.25);
    return { opacity: t, translateY: 20 * (1 - t) };
  }

  if (local > 0.75) {
    // --- SALIDA: del 75% al 100% del rango de la fase ---
    // Normalizar a 0-1, aplicar expo.in, invertir.
    // Sale hacia arriba (−20px) para que se note el gesto distinto.
    const t = _easeIn((local - 0.75) / 0.25);
    return { opacity: 1 - t, translateY: -20 * t };
  }

  // --- VISIBLE: 25%–75%, completamente revelado ---
  return { opacity: 1, translateY: 0 };
}

/**
 * Versión con offset: aplica un desplazamiento sobre scrollProgress
 * para crear stagger entre sub-elementos (label → acento → título → cuerpo).
 *
 * @param scrollProgress - progreso global
 * @param phase - rango de la fase
 * @param staggerOffset - offset en unidades de scrollProgress
 */
export function getTextRevealStateStaggered(
  scrollProgress: number,
  phase: { start: number; end: number },
  staggerOffset: number,
): RevealState {
  return getTextRevealState(scrollProgress - staggerOffset, phase);
}