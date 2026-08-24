/**
 * Grupos lógicos de meshes para la vista explosionada del Porsche GT3 RS.
 *
 * Cada grupo mapea un nombre semántico a:
 * - nodeKeys: lista de keys del GLTFResult.nodes que lo componen
 * - direction: vector normalizado de dirección de desplazamiento
 *
 * carroceria es el ancla (offset cero), los demás se separan
 * en direcciones ortogonales para un despiece claro.
 *
 * DISTANCIA: el factor base es 1.5 unidades, escalado por explodeFactor.
 */

import type { Vector3Tuple } from "three";

export interface ExplodeGroup {
  /** Keys de los nodos del GLTF que pertenecen a este grupo */
  nodeKeys: string[];
  /** Dirección normalizada de separación */
  direction: Vector3Tuple;
}

export const EXPLODE_GROUPS: Record<string, ExplodeGroup> = {
  carroceria: {
    nodeKeys: [
      "TwiXeR_992_body_gt3rs_TwiXeR_992_plastic002_0",
      "TwiXeR_992_body_gt3rs_TwiXeR_992_ID10_chrome001_0",
      "TwiXeR_992_body_gt3rs_TwiXeR_992_undercarriage001_0",
      "TwiXeR_992_body_gt3rs_TwiXeR_992_ID12_paint001_0",
      "TwiXeR_992_body_gt3rs_TwiXeR_992_roof_alc001_0",
      "TwiXeR_992_gt3rs_sideskirts_L_TwiXeR_992_glass002_0",
      "TwiXeR_992_gt3rs_sideskirts_L_TwiXeR_992_headlight001_0",
      "TwiXeR_992_gt3rs_door_L_TwiXeR_992_rubbertrim004_0",
    ],
    direction: [0, 0, 0], // ancla, no se mueve
  },
  capo_motor: {
    nodeKeys: [
      "TwiXeR_992_gt3rs_carbon_hood_TwiXeR_992_metal_radiator002_0",
      "TwiXeR_992_gt3rs_carbon_hood_TwiXeR_992_carPaint_secondary|hoodbadge_a001_0",
      "TwiXeR_992_gt3rs_carbon_Wing_TwiXeR_992_plastic_mgl_060606FF001_0",
      "TwiXeR_992_gt3rs_carbon_Wing_TwiXeR_992_carbon_roof001_0",
    ],
    direction: [0, 1, 0], // ↑ hacia arriba
  },
  iluminacion_cromados: {
    nodeKeys: [
      "TwiXeR_992_headlight_L_led_TwiXeR_992_headlight_high001_0",
      "TwiXeR_992_body_chrome_end_TwiXeR_992_chrome003_0",
    ],
    direction: [1, 0, 0], // → lateral
  },
  habitaculo: {
    nodeKeys: [
      "TwiXeR_992_steer_3_TwiXeR_992_ID06_stitch_001_0",
      "TwiXeR_992_steer_3_TwiXeR_992_carpet002_0",
      "TwiXeR_992_steer_3_TwiXeR_992_symbols_6_0",
      "TwiXeR_992_dash_9000_TwiXeR_992_ID03_stitch_001_111111FF006_0",
      "TwiXeR_992_dash_9000_TwiXeR_992_plastic004_0",
      "TwiXeR_992_dash_9000_TwiXeR_992_seat_leather004_0",
      "TwiXeR_992_dash_9000_TwiXeR_992_upper_leather004_0",
      "TwiXeR_992_dash_9000_TwiXeR_992_gauges_9000001_0",
      "TwiXeR_992_gauges_screen_TwiXeR_992_gauges_screen001_0",
      "TwiXeR_992_seat_FL_TwiXeR_992_seat_leather_2001_0",
    ],
    direction: [0, 0, 1], // → hacia delante (Z+)
  },
};

/** Distancia máxima de separación en unidades de mundo. */
export const EXPLODE_DISTANCE = 1.5;