/**
 * Keyframes de cámara para la coreografía ligada al scroll.
 *
 * Cada segmento define un tramo del scroll (0-1) con posición
 * y punto de mirada inicial y final. La interpolación entre ellos
 * se aplica con easing expo.inOut para un timing seco y mecánico
 * (inspiración: la home de Anime.js).
 *
 * Sprint 4: añadido Tramo 5 (vista general para explosión).
 * Los tramos 1-4 se reescalan proporcionalmente para dejar espacio.
 */

export interface CameraSegment {
  /** Inicio del tramo en scrollProgress (0-1) */
  scrollStart: number;
  /** Fin del tramo en scrollProgress (0-1) */
  scrollEnd: number;
  /** Posición de cámara al inicio del tramo */
  fromPosition: [number, number, number];
  /** Posición de cámara al final del tramo */
  toPosition: [number, number, number];
  /** Punto de mirada al inicio del tramo */
  fromLookAt: [number, number, number];
  /** Punto de mirada al final del tramo */
  toLookAt: [number, number, number];
}

export const CAMERA_SEGMENTS: CameraSegment[] = [
  {
    // Tramo 1: Hero — cámara estática frontal-lateral elevada.
    scrollStart: 0,
    scrollEnd: 0.12,
    fromPosition: [5, 2.2, 6],
    toPosition: [5, 2.2, 6],
    fromLookAt: [0, 0.5, 0],
    toLookAt: [0, 0.5, 0],
  },
  {
    // Tramo 2: Backend/motor — acercamiento agresivo a la zona
    // trasera del coche.
    scrollStart: 0.12,
    scrollEnd: 0.36,
    fromPosition: [5, 2.2, 6],
    toPosition: [1.5, 0.9, -3],
    fromLookAt: [0, 0.5, 0],
    toLookAt: [0, 0.7, -2.5],
  },
  {
    // Tramo 3: Transición — la cámara se retira a una posición
    // elevada central. Coincide con el cambio de color de fondo.
    scrollStart: 0.36,
    scrollEnd: 0.48,
    fromPosition: [1.5, 0.9, -3],
    toPosition: [0, 3, 4],
    fromLookAt: [0, 0.7, -2.5],
    toLookAt: [0, 0.5, 0],
  },
  {
    // Tramo 4: Frontend/habitáculo — entrada al lateral del
    // chasis, mostrando el interior.
    scrollStart: 0.48,
    scrollEnd: 0.8,
    fromPosition: [0, 3, 4],
    toPosition: [1.2, 1, 0.5],
    fromLookAt: [0, 0.5, 0],
    toLookAt: [0, 0.8, 0],
  },
  {
    // Tramo 5 (Sprint 4): Vista general — la cámara se aleja a
    // una posición elevada para apreciar el despiece completo.
    scrollStart: 0.8,
    scrollEnd: 1.0,
    fromPosition: [1.2, 1, 0.5],
    toPosition: [4, 4, 7],
    fromLookAt: [0, 0.8, 0],
    toLookAt: [0, 1, 0],
  },
];