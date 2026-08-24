export default function Lighting() {
  return (
    <>
      {/* Ambiental baja pero no nula: evita negros absolutos sin detalle. */}
      <ambientLight intensity={0.12} />

      {/* Key light: luz principal dura desde lateral-alto.
          Intensidad x1.6 respecto al Sprint 1 para compensar
          el tone mapping ACES que oscurece las altas luces. */}
      <directionalLight
        position={[6, 8, 4]}
        intensity={4}
        color="#ffffff"
        castShadow
      />

      {/* Rim / contorno: luz azulada detrás del coche para separar
          la silueta del fondo negro. x1.4 sobre el valor original. */}
      <spotLight
        position={[-5, 4, -6]}
        intensity={5.6}
        angle={0.5}
        penumbra={0.4}
        color="#8fb4ff"
      />

      {/* Fill sutil desde el lado opuesto a la key. */}
      <directionalLight position={[-4, 2, 3]} intensity={0.3} color="#ffffff" />
    </>
  );
}