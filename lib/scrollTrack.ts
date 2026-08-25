/**
 * Medición del recorrido 3D (track de scroll).
 *
 * Sprint 8: el Canvas sticky vive dentro de un contenedor con altura
 * fija (700vh) y el scroll normal continúa después. Este helper es la
 * fuente única para medir dónde empieza/termina ese contenedor, usado
 * por useLenisScroll (progreso 0-1 solo dentro del track) y por
 * ContentOverlay (fade del overlay al soltar el sticky).
 */

export const SCROLL_TRACK_ID = "scroll-track";

export interface TrackBounds {
  top: number;
  bottom: number;
  height: number;
}

/** Límites absolutos (documento) del contenedor del recorrido 3D. */
export function getScrollTrackBounds(): TrackBounds {
  if (typeof window === "undefined") {
    return { top: 0, bottom: 0, height: 0 };
  }

  const el = document.getElementById(SCROLL_TRACK_ID);
  if (!el) {
    // Fallback: todo el documento (no debería ocurrir en producción).
    const height = document.documentElement.scrollHeight;
    return { top: 0, bottom: height, height };
  }

  const rect = el.getBoundingClientRect();
  const top = rect.top + window.scrollY;
  const height = rect.height;
  return { top, bottom: top + height, height };
}
