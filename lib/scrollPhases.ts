/**
 * Fuente única de verdad para las fases de scroll.
 *
 * Todas las partes del proyecto que dependen del progreso de scroll
 * (cámara, fondo, vista explosionada, overlays de contenido) importan
 * sus rangos desde aquí para mantener consistencia y evitar duplicación.
 *
 * Sprint 11A: anchos FIJOS y definitivos (en vez de otro reescalado
 * proporcional sobre el estado acumulado, que había descompensado los
 * anchos). Cada fase mantiene su holdFraction, que es una proporción
 * RELATIVA a su propio ancho y no se ve afectada por este cambio.
 *
 * Orden: intro  hero  sobre-mi  backend  frontend  ia  explode
 * Ancho: 0.06   0.09  0.11      0.19     0.19      0.14 0.22 = 1.00 ✓
 */

export interface ScrollPhase {
  name: string;
  start: number;
  end: number;
  /**
   * Fracción final del rango (0-1) donde la cámara ya está asentada
   * en su encuadre de destino. El texto se revela durante este hold,
   * no durante el tránsito.
   */
  holdFraction?: number;
}

/** Fases de la coreografía de cámara. */
export const CAMERA_PHASES = {
  intro: { name: "intro", start: 0, end: 0.06, holdFraction: 0 },
  hero: { name: "hero", start: 0.06, end: 0.15, holdFraction: 0 },
  "sobre-mi": {
    name: "sobre-mi",
    start: 0.15,
    end: 0.26,
    holdFraction: 0,
  },
  backend: {
    name: "backend",
    start: 0.26,
    end: 0.45,
    holdFraction: 0.35,
  },
  frontend: {
    name: "frontend",
    start: 0.45,
    end: 0.64,
    holdFraction: 0.35,
  },
  ia: {
    name: "ia",
    start: 0.64,
    end: 0.78,
    holdFraction: 0,
  },
  explode: {
    name: "explode",
    start: 0.78,
    end: 1.0,
    holdFraction: 0.35,
  },
} as const satisfies Record<string, ScrollPhase>;

export const CAMERA_PHASES_LIST: ScrollPhase[] =
  Object.values(CAMERA_PHASES);

/** Rango de la transición de color de fondo (anclado a la fase ia). */
export const BG_TRANSITION = {
  start: CAMERA_PHASES.ia.start,
  peak: (CAMERA_PHASES.ia.start + CAMERA_PHASES.ia.end) / 2,
  end: CAMERA_PHASES.ia.end,
} as const;

/** Rango de la vista explosionada. */
export const EXPLODE_RANGE = {
  start: CAMERA_PHASES.explode.start,
  end: CAMERA_PHASES.explode.end,
} as const;

/**
 * Devuelve el nombre de la fase de cámara activa para un
 * scrollProgress dado.
 */
export function getActiveCameraPhase(scrollProgress: number): ScrollPhase {
  for (let i = CAMERA_PHASES_LIST.length - 1; i >= 0; i--) {
    if (scrollProgress >= CAMERA_PHASES_LIST[i].start) {
      return CAMERA_PHASES_LIST[i];
    }
  }
  return CAMERA_PHASES.intro;
}
