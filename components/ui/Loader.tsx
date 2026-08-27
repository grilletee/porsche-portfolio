"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";

// ---------------------------------------------------------------------------
// Loader de carga del modelo 3D (Sprint 12B).
//
// useProgress de @react-three/drei reporta el progreso REAL de descarga
// del .glb que carga useGLTF (useLoader registra las cargas en el
// DefaultLoadingManager de three, que es lo que useProgress escucha).
//
// Al llegar a 100% (o ante un error de carga) hace un fade out de 0.4s
// y luego se DESMONTA del DOM: no deja espacio ocupado ni captura clicks.
// ---------------------------------------------------------------------------

const FADE_MS = 400;
// Red de seguridad: si el progreso nunca llega a 100 (p. ej. el modelo
// ya estaba en caché interna de drei y no se emitieron eventos de
// carga), el overlay se retira igualmente y nunca queda colgado.
const MAX_VISIBLE_MS = 15000;

export default function Loader() {
  const { progress, errors } = useProgress();
  const [fading, setFading] = useState(false);
  const [mounted, setMounted] = useState(true);

  const done = progress >= 100 || errors.length > 0;

  // Progreso completado (o error): arranca el fade out.
  useEffect(() => {
    if (done) setFading(true);
  }, [done]);

  // Red de seguridad por tiempo máximo visible.
  useEffect(() => {
    const t = setTimeout(() => setFading(true), MAX_VISIBLE_MS);
    return () => clearTimeout(t);
  }, []);

  // Una vez en fade, esperamos a que termine la transición y desmontamos.
  useEffect(() => {
    if (!fading) return;
    const t = setTimeout(() => setMounted(false), FADE_MS + 50);
    return () => clearTimeout(t);
  }, [fading]);

  if (!mounted) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Cargando experiencia 3D"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
        background: "#050505",
        opacity: fading ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease-out`,
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      {/* Porcentaje grande en Space Grotesk (la variable está definida
          en app/layout.tsx). tabular-nums evita que el número "baile"
          al cambiar de dígito. */}
      <div
        style={{
          fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
          fontWeight: 700,
          fontSize: "clamp(3rem, 10vw, 5rem)",
          color: "#f5f5f5",
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {Math.round(progress)}%
      </div>

      {/* Barra fina de progreso con el acento rojo del proyecto. */}
      <div
        style={{
          width: "min(280px, 60vw)",
          height: 2,
          borderRadius: 2,
          background: "rgba(245, 245, 245, 0.12)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "#ff3b30",
            transition: "width 0.2s linear",
          }}
        />
      </div>
    </div>
  );
}
