import { create } from "zustand";

export type QualityTier = "high" | "medium" | "low";

interface QualityState {
  qualityTier: QualityTier;
  setQualityTier: (tier: QualityTier) => void;
}

/**
 * Store de calidad adaptativa (Sprint 11A): gobernado por el
 * PerformanceMonitor de drei según el frame rate REAL (no el tamaño
 * de pantalla). 'high' (default) = todo activo, 'medium' = sin Bloom
 * y dpr 1, 'low' = además sin Environment y luz de acompañamiento a
 * media potencia. El modelo 3D, la cámara y el despiece NUNCA se
 * desactivan.
 */
export const useQualityStore = create<QualityState>((set) => ({
  qualityTier: "high",
  // Si el tier no cambia, devolvemos el estado actual sin mutar:
  // evita re-renders redundantes cuando el monitor reporta el mismo
  // nivel en ventanas consecutivas.
  setQualityTier: (tier) =>
    set((state) => (state.qualityTier === tier ? state : { qualityTier: tier })),
}));
