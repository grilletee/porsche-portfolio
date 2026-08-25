/**
 * Fuente única de verdad para las fases de scroll.
 *
 * Todas las partes del proyecto que dependen del progreso de scroll
 * (cámara, fondo, vista explosionada, overlays de contenido) importan
 * sus rangos desde aquí para mantener consistencia y evitar duplicación.
 *
 * Sprint 5: extraídos los rangos reales que ya funcionaban en
 * cameraPath.ts, useBackgroundColor.ts y useExplodedView.ts.
 */

export interface ScrollPhase {
  name: string;
  start: number;
  end: number;
  /**
   * Fracción final del rango (0-1) donde la cámara ya está asentada
   * en su encuadre de destino. El texto se revela durante este hold,
   * no durante el tránsito. Un valor de 0 o ausente significa que
   * la cámara es estática o la ventana de texto es la clásica
   * 25%-50%-25% (sin distinción tránsito/hold).
   */
  holdFraction?: number;
}

/** Fases de la coreografía de cámara. */
export const CAMERA_PHASES = {
  hero: { name: "hero", start: 0, end: 0.12, holdFraction: 0 },
  backend: { name: "backend", start: 0.12, end: 0.36, holdFraction: 0.35 },
  transicion: { name: "transicion", start: 0.36, end: 0.48, holdFraction: 0 },
  frontend: { name: "frontend", start: 0.48, end: 0.8, holdFraction: 0.35 },
  explode: { name: "explode", start: 0.8, end: 1.0, holdFraction: 0.35 },
} as const satisfies Record<string, ScrollPhase>;

export const CAMERA_PHASES_LIST: ScrollPhase[] =
  Object.values(CAMERA_PHASES);

/** Rango de la transición de color de fondo. */
export const BG_TRANSITION = {
  start: 0.35,
  peak: 0.55,   // punto medio donde el fondo es #e8e8e8
  end: 0.75,
} as const;

/** Rango de la vista explosionada. */
export const EXPLODE_RANGE = {
  start: 0.8,
  end: 1.0,
} as const;

/**
 * Devuelve el nombre de la fase de cámara activa para un
 * scrollProgress dado. Útil para overlays de contenido.
 */
export function getActiveCameraPhase(scrollProgress: number): ScrollPhase {
  for (let i = CAMERA_PHASES_LIST.length - 1; i >= 0; i--) {
    if (scrollProgress >= CAMERA_PHASES_LIST[i].start) {
      return CAMERA_PHASES_LIST[i];
    }
  }
  return CAMERA_PHASES.hero;
}