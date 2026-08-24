import { create } from "zustand";

interface ScrollState {
  scrollProgress: number;
  setScrollProgress: (value: number) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  scrollProgress: 0,
  setScrollProgress: (value: number) =>
    set({ scrollProgress: Math.max(0, Math.min(1, value)) }),
}));