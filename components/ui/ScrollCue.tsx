"use client";

import { useEffect, useRef } from "react";
import { useScrollStore } from "@/store/useScrollStore";
import { CAMERA_PHASES } from "@/lib/scrollPhases";

const CUE_STYLE: React.CSSProperties = {
  position: "fixed",
  left: "50%",
  bottom: "max(24px, env(safe-area-inset-bottom))",
  zIndex: 12,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 10,
  transform: "translateX(-50%)",
  color: "rgba(245, 245, 245, 0.5)",
  transition: "opacity 0.5s ease",
  pointerEvents: "none",
};

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: "var(--font-jetbrains-mono), monospace",
  fontSize: "0.65rem",
  letterSpacing: "0.28em",
};

const LINE_STYLE: React.CSSProperties = {
  width: 1,
  height: 34,
  background: "currentColor",
  animation: "scroll-cue-bob 1.6s ease-in-out infinite",
};

export default function ScrollCue() {
  const cueRef = useRef<HTMLDivElement>(null);
  const hasMovedRef = useRef(false);

  useEffect(() => {
    const update = (scrollProgress: number) => {
      if (scrollProgress > 0.02) hasMovedRef.current = true;
      const visible =
        !hasMovedRef.current &&
        scrollProgress >= CAMERA_PHASES.hero.start &&
        scrollProgress <= CAMERA_PHASES.hero.end;
      if (cueRef.current) cueRef.current.style.opacity = visible ? "1" : "0";
    };

    const unsubscribe = useScrollStore.subscribe((state) => update(state.scrollProgress));
    update(useScrollStore.getState().scrollProgress);
    return unsubscribe;
  }, []);

  return (
    <div ref={cueRef} style={CUE_STYLE} aria-hidden="true">
      <span style={LABEL_STYLE}>SCROLL</span>
      <span style={LINE_STYLE} />
    </div>
  );
}
