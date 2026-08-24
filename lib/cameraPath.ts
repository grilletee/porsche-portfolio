/**
 * Keyframes de cámara para la coreografía ligada al scroll.
 *
 * Cada segmento define un tramo del scroll (0-1) con posición
 * y punto de mirada inicial y final. La interpolación entre ellos
 * se aplica con easing expo.inOut para un timing seco y mecánico
 * (inspiración: la home de Anime.js).
 *
 * Rangos de scroll: importados desde /lib/scrollPhases.ts (fuente única).
 */

import { CAMERA_PHASES } from "@/lib/scrollPhases";

export interface CameraSegment {
  scrollStart: number;
  scrollEnd: number;
  fromPosition: [number, number, number];
  toPosition: [number, number, number];
  fromLookAt: [number, number, number];
  toLookAt: [number, number, number];
}

export const CAMERA_SEGMENTS: CameraSegment[] = [
  {
    // Tramo 1: Hero — cámara estática frontal-lateral elevada.
    scrollStart: CAMERA_PHASES.hero.start,
    scrollEnd: CAMERA_PHASES.hero.end,
    fromPosition: [5, 2.2, 6],
    toPosition: [5, 2.2, 6],
    fromLookAt: [0, 0.5, 0],
    toLookAt: [0, 0.5, 0],
  },
  {
    // Tramo 2: Backend/motor — acercamiento agresivo a la zona trasera.
    scrollStart: CAMERA_PHASES.backend.start,
    scrollEnd: CAMERA_PHASES.backend.end,
    fromPosition: [5, 2.2, 6],
    toPosition: [1.5, 0.9, -3],
    fromLookAt: [0, 0.5, 0],
    toLookAt: [0, 0.7, -2.5],
  },
  {
    // Tramo 3: Transición — cámara se retira a posición elevada central.
    scrollStart: CAMERA_PHASES.transicion.start,
    scrollEnd: CAMERA_PHASES.transicion.end,
    fromPosition: [1.5, 0.9, -3],
    toPosition: [0, 3, 4],
    fromLookAt: [0, 0.7, -2.5],
    toLookAt: [0, 0.5, 0],
  },
  {
    // Tramo 4: Frontend/habitáculo — entrada al lateral del chasis.
    scrollStart: CAMERA_PHASES.frontend.start,
    scrollEnd: CAMERA_PHASES.frontend.end,
    fromPosition: [0, 3, 4],
    toPosition: [1.2, 1, 0.5],
    fromLookAt: [0, 0.5, 0],
    toLookAt: [0, 0.8, 0],
  },
  {
    // Tramo 5: Vista general — para apreciar el despiece completo.
    scrollStart: CAMERA_PHASES.explode.start,
    scrollEnd: CAMERA_PHASES.explode.end,
    fromPosition: [1.2, 1, 0.5],
    toPosition: [4, 4, 7],
    fromLookAt: [0, 0.8, 0],
    toLookAt: [0, 1, 0],
  },
];