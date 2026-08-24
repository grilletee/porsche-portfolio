# Porsche Portfolio — Sprint 1 (fundación)

Esto es la base del Sprint 1 escrita a mano, mientras Freebuff recupera cuota.
Cuando vuelva Freebuff, puedes seguir desde el Sprint 2 directamente sobre
este mismo proyecto — no hace falta rehacer nada.

## Pasos para dejarlo funcionando con TU modelo real

1. **Copia tus archivos reales** (los que ya generaste con gltfjsx):
   - Tu `porsche-transformed.glb` → `public/models/porsche-transformed.glb`
   - Tu `Porsche.tsx` real (el que generó gltfjsx) →
     sustituye `components/canvas/Porsche.tsx` (este repo trae un
     placeholder con una caja simple, bórralo y pon el tuyo)

2. **Instala dependencias:**
   ```bash
   npm install
   ```

3. **Arranca en local:**
   ```bash
   npm run dev
   ```
   Abre http://localhost:3000

## Qué deberías ver

- Fondo negro casi puro (#050505)
- El modelo (placeholder: una caja; con tu .glb real: el Porsche completo)
  iluminado con contraste duro — zonas muy claras y sombras profundas,
  no una iluminación plana ni un HDRI genérico
- Un borde de luz azulada sutil separando la silueta del fondo (rim light)
- Puedes orbitar con el ratón (OrbitControls) para inspeccionar el modelo
  desde cualquier ángulo — esto es temporal, se quita en el Sprint 3

## Si tu Porsche.tsx real usa una ruta distinta al .glb

Abre tu `Porsche.tsx` generado y confirma que la línea `useGLTF(...)`
apunta a `/models/porsche-transformed.glb` (con la barra inicial, así
Next.js lo resuelve desde `/public`). Ajusta si gltfjsx usó otra ruta.

## Siguiente paso

Cuando confirmes visualmente que esto funciona, el Sprint 2 añade:
Lenis + GSAP ScrollTrigger + un store de Zustand con `scrollProgress`.
Pide ese prompt cuando estés listo (a mí o a Freebuff, indistinto —
el código es compatible con ambos).
