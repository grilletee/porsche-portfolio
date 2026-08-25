/**
 * Keyframes de cámara para la coreografía ligada al scroll.
 *
 * Cada segmento define un tramo del scroll (0-1) con posición
 * y punto de mirada inicial y final. La interpolación entre ellos
 * se aplica con easing expo.inOut para un timing seco y mecánico
 * (inspiración: la home de Anime.js).
 *
 * holdFraction (desde scrollPhases.ts): fracción del tramo donde
 * la cámara ya está asentada. La interpolación se comprime en
 * (1 - holdFraction) del rango; el resto permanece fija en destino.
 *
 * Sprint 7A: fase "ia" (antes "transicion") movida entre frontend y
 * explode. Keyframe enfoca el panel de gauges/pantalla digital del
 * habitáculo (nodo TwiXeR_992_gauges_screen).
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
    // Tramo 0: Intro — dolly-in desde un plano abierto al encuadre hero.
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
    // Tramo 1.5 (Sprint 9B): Sobre mí — micro-paneo lateral sutil.
    // La cámara permanece fija en la posición del Hero y solo gira
    // unos grados hacia la derecha. El protagonismo lo lleva el texto.
    scrollStart: CAMERA_PHASES["sobre-mi"].start,
    scrollEnd: CAMERA_PHASES["sobre-mi"].end,
    holdFraction: CAMERA_PHASES["sobre-mi"].holdFraction,
    fromPosition: [5, 2.2, 6],
    toPosition: [5, 2.2, 6],
    fromLookAt: [0, 0.5, 0],
    toLookAt: [0.35, 0.5, 0.25],
  },
  {
    // Tramo 2: Backend/motor — acercamiento agresivo a la zona trasera.
    scrollStart: CAMERA_PHASES.backend.start,
    scrollEnd: CAMERA_PHASES.backend.end,
    holdFraction: CAMERA_PHASES.backend.holdFraction,
    fromPosition: [5, 2.2, 6],
    toPosition: [1.5, 0.9, -3],
    fromLookAt: [0.35, 0.5, 0.25],
    toLookAt: [0, 0.7, -2.5],
  },
  {
    // Tramo 3: Frontend/habitáculo — entrada al lateral del chasis.
    scrollStart: CAMERA_PHASES.frontend.start,
    scrollEnd: CAMERA_PHASES.frontend.end,
    holdFraction: CAMERA_PHASES.frontend.holdFraction,
    fromPosition: [1.5, 0.9, -3],
    toPosition: [1.2, 1, 0.5],
    fromLookAt: [0, 0.7, -2.5],
    toLookAt: [0, 0.8, 0],
  },
  {
    // Tramo 4 (Sprint 7A): IA — close-up del panel de gauges/pantalla
    // digital como metáfora de "pantalla digital = IA".
    // El nodo de referencia está en [0.338, 0.797, 0.367].
    scrollStart: CAMERA_PHASES.ia.start,
    scrollEnd: CAMERA_PHASES.ia.end,
    holdFraction: CAMERA_PHASES.ia.holdFraction,
    fromPosition: [1.2, 1, 0.5],
    toPosition: [2, 1.2, 1.8],
    fromLookAt: [0, 0.8, 0],
    toLookAt: [0.338, 0.797, 0.367],
  },
  {
    // Tramo 5: Vista general — para apreciar el despiece completo.
    scrollStart: CAMERA_PHASES.explode.start,
    scrollEnd: CAMERA_PHASES.explode.end,
    holdFraction: CAMERA_PHASES.explode.holdFraction,
    fromPosition: [2, 1.2, 1.8],
    toPosition: [4, 4, 7],
    fromLookAt: [0.338, 0.797, 0.367],
    toLookAt: [0, 1, 0],
  },
];