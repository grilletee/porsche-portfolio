"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useExplodedView } from "@/hooks/useExplodedView";
import { EXPLODE_GROUPS, EXPLODE_DISTANCE } from "@/lib/explodeGroups";

/**
 * Wrapper del modelo Porsche GT3 RS que organiza los 24 meshes en
 * 4 grupos lógicos (carroceria, capo_motor, iluminacion_cromados,
 * habitaculo) y aplica offsets de vista explosionada ligados al scroll.
 *
 * No modifica el archivo auto-generado Porsche.tsx: usa useGLTF
 * directamente (el modelo está cacheado por drei, no se recarga).
 */

// ---------------------------------------------------------------------------
// Helper: mapea cada node key al grupo al que pertenece.
// ---------------------------------------------------------------------------
const nodeToGroup: Record<string, string> = {};
for (const [groupName, group] of Object.entries(EXPLODE_GROUPS)) {
  for (const key of group.nodeKeys) {
    nodeToGroup[key] = groupName;
  }
}

// ---------------------------------------------------------------------------
// Helper: asigna material a cada node key (replica exacta del original).
// ---------------------------------------------------------------------------
function getMaterial(
  key: string,
  materials: Record<string, THREE.Material>,
): THREE.Material {
  const map: Record<string, string> = {
    TwiXeR_992_gt3rs_carbon_Wing_TwiXeR_992_plastic_mgl_060606FF001_0:
      "PaletteMaterial001",
    TwiXeR_992_gt3rs_carbon_Wing_TwiXeR_992_carbon_roof001_0:
      "TwiXeR_992_carbon_roof.001",
    TwiXeR_992_gt3rs_carbon_hood_TwiXeR_992_metal_radiator002_0:
      "TwiXeR_992_metal_radiator.002",
    "TwiXeR_992_gt3rs_carbon_hood_TwiXeR_992_carPaint_secondary|hoodbadge_a001_0":
      "TwiXeR_992_headlight_1.001_0",
    TwiXeR_992_gt3rs_sideskirts_L_TwiXeR_992_glass002_0:
      "PaletteMaterial002",
    TwiXeR_992_gt3rs_sideskirts_L_TwiXeR_992_headlight001_0:
      "TwiXeR_992_symbols.004",
    TwiXeR_992_gt3rs_door_L_TwiXeR_992_rubbertrim004_0:
      "TwiXeR_992_headlight_1.001_1",
    TwiXeR_992_body_gt3rs_TwiXeR_992_plastic002_0:
      "TwiXeR_992_symbols.004_0",
    TwiXeR_992_body_gt3rs_TwiXeR_992_ID10_chrome001_0:
      "TwiXeR_992_symbols_1.003",
    TwiXeR_992_body_gt3rs_TwiXeR_992_undercarriage001_0:
      "TwiXeR_992_symbols.004_1",
    TwiXeR_992_body_gt3rs_TwiXeR_992_ID12_paint001_0:
      "TwiXeR_992_symbols.004_2",
    TwiXeR_992_body_gt3rs_TwiXeR_992_roof_alc001_0:
      "TwiXeR_992_headlight_1.001_2",
    TwiXeR_992_steer_3_TwiXeR_992_ID06_stitch_001_0:
      "TwiXeR_992_ID06_stitch_001",
    TwiXeR_992_steer_3_TwiXeR_992_carpet002_0: "TwiXeR_992_carpet.002",
    TwiXeR_992_steer_3_TwiXeR_992_symbols_6_0: "TwiXeR_992_symbols_6",
    TwiXeR_992_dash_9000_TwiXeR_992_ID03_stitch_001_111111FF006_0:
      "TwiXeR_992_ID03_stitch_001_111111FF.006",
    TwiXeR_992_dash_9000_TwiXeR_992_plastic004_0:
      "TwiXeR_992_plastic.004",
    TwiXeR_992_dash_9000_TwiXeR_992_seat_leather004_0:
      "TwiXeR_992_seat_leather.004",
    TwiXeR_992_dash_9000_TwiXeR_992_upper_leather004_0:
      "TwiXeR_992_upper_leather.004",
    TwiXeR_992_dash_9000_TwiXeR_992_gauges_9000001_0:
      "TwiXeR_992_gauges_9000.001_0",
    TwiXeR_992_gauges_screen_TwiXeR_992_gauges_screen001_0:
      "TwiXeR_992_gauges_screen.001",
    TwiXeR_992_headlight_L_led_TwiXeR_992_headlight_high001_0:
      "PaletteMaterial003",
    TwiXeR_992_seat_FL_TwiXeR_992_seat_leather_2001_0:
      "TwiXeR_992_seat_leather_2.001",
    TwiXeR_992_body_chrome_end_TwiXeR_992_chrome003_0:
      "TwiXeR_992_chrome.003",
  };
  return materials[map[key]];
}

// ---------------------------------------------------------------------------
// Mesh data estático: posición y rotación originales de cada node.
// Generado a partir de la salida de gltfjsx.
// ---------------------------------------------------------------------------
interface MeshDef {
  pos: [number, number, number];
  rot: [number, number, number];
}

const meshDefs: Record<string, MeshDef> = {
  TwiXeR_992_gt3rs_carbon_Wing_TwiXeR_992_plastic_mgl_060606FF001_0: {
    pos: [0, 1.233, -2.098],
    rot: [-Math.PI / 2, 0, 0],
  },
  TwiXeR_992_gt3rs_carbon_Wing_TwiXeR_992_carbon_roof001_0: {
    pos: [0, 1.233, -2.098],
    rot: [-Math.PI / 2, 0, 0],
  },
  TwiXeR_992_gt3rs_carbon_hood_TwiXeR_992_metal_radiator002_0: {
    pos: [0, 0.725, 1.58],
    rot: [-Math.PI / 2, 0, 0],
  },
  "TwiXeR_992_gt3rs_carbon_hood_TwiXeR_992_carPaint_secondary|hoodbadge_a001_0": {
    pos: [0, 0.725, 1.58],
    rot: [-Math.PI / 2, 0, 0],
  },
  TwiXeR_992_gt3rs_sideskirts_L_TwiXeR_992_glass002_0: {
    pos: [0.887, 0.321, 0.47],
    rot: [-Math.PI / 2, 0, 0],
  },
  TwiXeR_992_gt3rs_sideskirts_L_TwiXeR_992_headlight001_0: {
    pos: [0.887, 0.321, 0.47],
    rot: [-Math.PI / 2, 0, 0],
  },
  TwiXeR_992_gt3rs_door_L_TwiXeR_992_rubbertrim004_0: {
    pos: [0.795, 0.545, -0.069],
    rot: [-Math.PI / 2, 0, 0],
  },
  TwiXeR_992_body_gt3rs_TwiXeR_992_plastic002_0: {
    pos: [0.013, 0.786, -0.396],
    rot: [-Math.PI / 2, 0, 0],
  },
  TwiXeR_992_body_gt3rs_TwiXeR_992_ID10_chrome001_0: {
    pos: [0.013, 0.786, -0.396],
    rot: [-Math.PI / 2, 0, 0],
  },
  TwiXeR_992_body_gt3rs_TwiXeR_992_undercarriage001_0: {
    pos: [0.013, 0.786, -0.396],
    rot: [-Math.PI / 2, 0, 0],
  },
  TwiXeR_992_body_gt3rs_TwiXeR_992_ID12_paint001_0: {
    pos: [0.013, 0.786, -0.396],
    rot: [-Math.PI / 2, 0, 0],
  },
  TwiXeR_992_body_gt3rs_TwiXeR_992_roof_alc001_0: {
    pos: [0.013, 0.786, -0.396],
    rot: [-Math.PI / 2, 0, 0],
  },
  TwiXeR_992_steer_3_TwiXeR_992_ID06_stitch_001_0: {
    pos: [0.345, 0.751, 0.192],
    rot: [-2.793, 0, Math.PI],
  },
  TwiXeR_992_steer_3_TwiXeR_992_carpet002_0: {
    pos: [0.345, 0.751, 0.192],
    rot: [-2.793, 0, Math.PI],
  },
  TwiXeR_992_steer_3_TwiXeR_992_symbols_6_0: {
    pos: [0.345, 0.751, 0.192],
    rot: [-2.793, 0, Math.PI],
  },
  TwiXeR_992_dash_9000_TwiXeR_992_ID03_stitch_001_111111FF006_0: {
    pos: [0.126, 0.691, 0.302],
    rot: [0, 0, 0],
  },
  TwiXeR_992_dash_9000_TwiXeR_992_plastic004_0: {
    pos: [0.126, 0.691, 0.302],
    rot: [0, 0, 0],
  },
  TwiXeR_992_dash_9000_TwiXeR_992_seat_leather004_0: {
    pos: [0.126, 0.691, 0.302],
    rot: [0, 0, 0],
  },
  TwiXeR_992_dash_9000_TwiXeR_992_upper_leather004_0: {
    pos: [0.126, 0.691, 0.302],
    rot: [0, 0, 0],
  },
  TwiXeR_992_dash_9000_TwiXeR_992_gauges_9000001_0: {
    pos: [0.126, 0.691, 0.302],
    rot: [0, 0, 0],
  },
  TwiXeR_992_gauges_screen_TwiXeR_992_gauges_screen001_0: {
    pos: [0.338, 0.797, 0.367],
    rot: [0, 0, 0],
  },
  TwiXeR_992_headlight_L_led_TwiXeR_992_headlight_high001_0: {
    pos: [0.697, 0.684, 1.612],
    rot: [0, 0, 0],
  },
  TwiXeR_992_seat_FL_TwiXeR_992_seat_leather_2001_0: {
    pos: [0.382, 0.578, -0.299],
    rot: [0, 0, 0],
  },
  TwiXeR_992_body_chrome_end_TwiXeR_992_chrome003_0: {
    pos: [0, 1.052, -0.609],
    rot: [0, 0, 0],
  },
};

// ---------------------------------------------------------------------------
// Componente
// ---------------------------------------------------------------------------
export default function PorscheExploded(
  props: JSX.IntrinsicElements["group"],
) {
  const explodeFactor = useExplodedView();
  const distance = EXPLODE_DISTANCE * explodeFactor;

  // Refs para cada grupo lógico.
  const refCarroceria = useRef<THREE.Group>(null);
  const refCapoMotor = useRef<THREE.Group>(null);
  const refIluminacion = useRef<THREE.Group>(null);
  const refHabitaculo = useRef<THREE.Group>(null);

  const { nodes, materials } = useGLTF(
    "/models/porsche-transformed.glb",
  ) as any;

  // Aplicar offsets de explosión cada frame.
  useFrame(() => {
    if (refCapoMotor.current) {
      refCapoMotor.current.position.set(0, distance, 0);
    }
    if (refIluminacion.current) {
      refIluminacion.current.position.set(distance, 0, 0);
    }
    if (refHabitaculo.current) {
      refHabitaculo.current.position.set(0, 0, distance);
    }
    // carroceria se queda en (0,0,0), no necesita frame update.
  });

  // Construir los meshes agrupados.
  const allKeys = Object.keys(meshDefs);

  return (
    <group {...props} dispose={null}>
      {/* carroceria (ancla) */}
      <group ref={refCarroceria}>
        {allKeys
          .filter((k) => nodeToGroup[k] === "carroceria")
          .map((k) => (
            <mesh
              key={k}
              geometry={nodes[k]?.geometry}
              material={getMaterial(k, materials as any)}
              position={meshDefs[k].pos}
              rotation={meshDefs[k].rot as any}
            />
          ))}
      </group>

      {/* capo_motor */}
      <group ref={refCapoMotor}>
        {allKeys
          .filter((k) => nodeToGroup[k] === "capo_motor")
          .map((k) => (
            <mesh
              key={k}
              geometry={nodes[k]?.geometry}
              material={getMaterial(k, materials as any)}
              position={meshDefs[k].pos}
              rotation={meshDefs[k].rot as any}
            />
          ))}
      </group>

      {/* iluminacion_cromados */}
      <group ref={refIluminacion}>
        {allKeys
          .filter((k) => nodeToGroup[k] === "iluminacion_cromados")
          .map((k) => (
            <mesh
              key={k}
              geometry={nodes[k]?.geometry}
              material={getMaterial(k, materials as any)}
              position={meshDefs[k].pos}
              rotation={meshDefs[k].rot as any}
            />
          ))}
      </group>

      {/* habitaculo */}
      <group ref={refHabitaculo}>
        {allKeys
          .filter((k) => nodeToGroup[k] === "habitaculo")
          .map((k) => (
            <mesh
              key={k}
              geometry={nodes[k]?.geometry}
              material={getMaterial(k, materials as any)}
              position={meshDefs[k].pos}
              rotation={meshDefs[k].rot as any}
            />
          ))}
      </group>
    </group>
  );
}

useGLTF.preload("/models/porsche-transformed.glb");