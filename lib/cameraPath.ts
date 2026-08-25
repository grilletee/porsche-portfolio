/**
 * Keyframes de cámara para la coreografía ligada al scroll.
 *
 * Cada segmento define un tramo del scroll (0-1) con posición
 * y punto de mirada inicial y final. La interpolación entre ellos
 * se aplica con easing expo.inOut para un timing seco y mecánico
 * (inspiración: la home de Anime.js). El segmento "intro" usa
 * expo.out como excepción (el easing por defecto se puede
 * sobreescribir con la propiedad easing opcional).
 *
 * holdFraction (desde scrollPhases.ts): fracción del tramo donde
 * la cámara ya está asentada. La interpolación se comprime en
 * (1 - holdFraction) del rango; el resto permanece fija en destino.
 *
 * Sprint 6: añadido segmento "intro" — barrido de cámara (dolly-in)
 * desde un plano abierto al encuadre hero.
 *
 * Rangos de scroll: importados desde /lib/scrollPhases.ts (fuente única).
 */

import { CAMERA_PHASES } from "@/lib/scrollPhases";

export interface CameraSegment {
  scrollStart: number;
  scrollEnd: number;
  holdFraction: number;
  fromPosition: [number, number, number];
  toPosition: [number, number, number];
  fromLookAt: [number, number, number];
  toLookAt: [number, number, number];
  /** Easing override (default: "expo.inOut" si no se especifica). */
  easing?: string;
}

export const CAMERA_SEGMENTS: CameraSegment[] = [
  {
    // Tramo 0 (Sprint 6): Intro — dolly-in desde un plano abierto
    // hasta el encuadre hero. La cámara llega rápido y frena en seco
    // (expo.out, como una frenada, no expo.inOut como los viajes).
    scrollStart: CAMERA_PHASES.intro.start,
    scrollEnd: CAMERA_PHASES.intro.end,
    holdFraction: CAMERA_PHASES.intro.holdFraction,
    fromPosition: [10, 5, 14],
    toPosition: [5, 2.2, 6],
    fromLookAt: [0, 0.5, 0],
    toLookAt: [0, 0.5, 0],
    easing: "expo.out",
  },
  {
    // Tramo 1: Hero — cámara estática frontal-lateral elevada.
    scrollStart: CAMERA_PHASES.hero.start,
    scrollEnd: CAMERA_PHASES.hero.end,
    holdFraction: CAMERA_PHASES.hero.holdFraction,
    fromPosition: [5, 2.2, 6],
    toPosition: [5, 2.2, 6],
    fromLookAt: [0, 0.5, 0],
    toLookAt: [0, 0.5, 0],
  },
  {
    // Tramo 2: Backend/motor — acercamiento agresivo a la zona trasera.
    scrollStart: CAMERA_PHASES.backend.start,
    scrollEnd: CAMERA_PHASES.backend.end,
    holdFraction: CAMERA_PHASES.backend.holdFraction,
    fromPosition: [5, 2.2, 6],
    toPosition: [1.5, 0.9, -3],
    fromLookAt: [0, 0.5, 0],
    toLookAt: [0, 0.7, -2.5],
  },
  {
    // Tramo 3: Transición — cámara se retira a posición elevada central.
    scrollStart: CAMERA_PHASES.transicion.start,
    scrollEnd: CAMERA_PHASES.transicion.end,
    holdFraction: CAMERA_PHASES.transicion.holdFraction,
    fromPosition: [1.5, 0.9, -3],
    toPosition: [0, 3, 4],
    fromLookAt: [0, 0.7, -2.5],
    toLookAt: [0, 0.5, 0],
  },
  {
    // Tramo 4: Frontend/habitáculo — entrada al lateral del chasis.
    scrollStart: CAMERA_PHASES.frontend.start,
    scrollEnd: CAMERA_PHASES.frontend.end,
    holdFraction: CAMERA_PHASES.frontend.holdFraction,
    fromPosition: [0, 3, 4],
    toPosition: [1.2, 1, 0.5],
    fromLookAt: [0, 0.5, 0],
    toLookAt: [0, 0.8, 0],
  },
  {
    // Tramo 5: Vista general — para apreciar el despiece completo.
    scrollStart: CAMERA_PHASES.explode.start,
    scrollEnd: CAMERA_PHASES.explode.end,
    holdFraction: CAMERA_PHASES.explode.holdFraction,
    fromPosition: [1.2, 1, 0.5],
    toPosition: [4, 4, 7],
    fromLookAt: [0, 0.8, 0],
    toLookAt: [0, 1, 0],
  },
];