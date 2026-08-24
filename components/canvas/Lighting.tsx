export default function Lighting() {
  return (
    <>
      {/* Ambiental casi nula: queremos negro puro fuera del coche, no un
          ambiente suave de estudio genérico. */}
      <ambientLight intensity={0.05} />

      {/* Key light: luz principal dura desde un lateral-alto. Crea el
          contraste marcado (zonas muy iluminadas vs sombras profundas)
          típico de fotografía automotriz de producto. */}
      <directionalLight
        position={[6, 8, 4]}
        intensity={2.5}
        color="#ffffff"
        castShadow
      />

      {/* Rim / contorno: luz detrás del coche para separar la silueta
          del fondo negro. Sin esto, el coche se funde con el fondo. */}
      <spotLight
        position={[-5, 4, -6]}
        intensity={4}
        angle={0.5}
        penumbra={0.4}
        color="#8fb4ff"
      />

      {/* Fill muy sutil desde el lado opuesto a la key, solo para que
          las sombras no se vean completamente negras/planas. */}
      <directionalLight position={[-4, 2, 3]} intensity={0.3} color="#ffffff" />
    </>
  );
}
