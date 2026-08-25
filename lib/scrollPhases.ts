/**
 * Fuente única de verdad para las fases de scroll.
 *
 * Todas las partes del proyecto que dependen del progreso de scroll
 * (cámara, fondo, vista explosionada, overlays de contenido) importan
 * sus rangos desde aquí para mantener consistencia y evitar duplicación.
 *
 * Sprint 6: fase "intro" (0–6%) — barrido de cámara (dolly-in) desde
 * un plano abierto al encuadre hero. El resto de fases se reescalan
 * proporcionalmente con new = 0.06 + old × 0.94.
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

// ---------------------------------------------------------------------------
// Rescalado proporcional:
//   new = introEnd + old * (1 - introEnd)
// ---------------------------------------------------------------------------
const INTRO_END = 0.06;
const SCALE = 1 - INTRO_END; // 0.94

/** Fases de la coreografía de cámara. */
export const CAMERA_PHASES = {
  intro: { name: "intro", start: 0, end: INTRO_END, holdFraction: 0 },
  hero: {
    name: "hero",
    start: INTRO_END + 0 * SCALE,
    end: INTRO_END + 0.12 * SCALE,
    holdFraction: 0,
  },
  backend: {
    name: "backend",
    start: INTRO_END + 0.12 * SCALE,
    end: INTRO_END + 0.36 * SCALE,
    holdFraction: 0.35,
  },
  transicion: {
    name: "transicion",
    start: INTRO_END + 0.36 * SCALE,
    end: INTRO_END + 0.48 * SCALE,
    holdFraction: 0,
  },
  frontend: {
    name: "frontend",
    start: INTRO_END + 0.48 * SCALE,
    end: INTRO_END + 0.8 * SCALE,
    holdFraction: 0.35,
  },
  explode: {
    name: "explode",
    start: INTRO_END + 0.8 * SCALE,
    end: INTRO_END + 1.0 * SCALE,
    holdFraction: 0.35,
  },
} as const satisfies Record<string, ScrollPhase>;

export const CAMERA_PHASES_LIST: ScrollPhase[] =
  Object.values(CAMERA_PHASES);

/** Rango de la transición de color de fondo (rescalado proporcionalmente). */
export const BG_TRANSITION = {
  start: INTRO_END + 0.35 * SCALE,
  peak: INTRO_END + 0.55 * SCALE,
  end: INTRO_END + 0.75 * SCALE,
} as const;

/** Rango de la vista explosionada (rescalado proporcionalmente). */
export const EXPLODE_RANGE = {
  start: INTRO_END + 0.8 * SCALE,
  end: INTRO_END + 1.0 * SCALE,
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