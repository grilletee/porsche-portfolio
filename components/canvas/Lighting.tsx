export default function Lighting() {
  return (
    <>
      {/* Ambiental baja pero no nula: evita negros absolutos sin detalle. */}
      <ambientLight intensity={0.12} />

      {/* Key light: luz principal dura desde lateral-alto.
          Ajustada a 70% del valor del Sprint 5. */}
      <directionalLight
        position={[6, 8, 4]}
        intensity={2.8}
        color="#ffffff"
        castShadow
      />

      {/* Rim / contorno: luz azulada detrás del coche para separar
          la silueta del fondo negro. Ajustada a 65% del Sprint 5. */}
      <spotLight
        position={[-5, 4, -6]}
        intensity={3.64}
        angle={0.5}
        penumbra={0.4}
        color="#8fb4ff"
      />

      {/* Fill sutil desde el lado opuesto a la key. */}
      <directionalLight position={[-4, 2, 3]} intensity={0.3} color="#ffffff" />
    </>
  );
}