import type { BodyParams } from "../biomechanics/model/bodyParams";
import { WINTER_BODY_PARAMS } from "./bodyParams";

export const PRESET_IDS = [
  "average",
  "shortFemur",
  "longFemur",
  "longTibia",
  "stiffAnkle",
  "limitedHip",
  "anteversion",
] as const;

export type PresetId = (typeof PRESET_IDS)[number];

export const PRESETS: Record<PresetId, BodyParams> = {
  average: WINTER_BODY_PARAMS,
  shortFemur: { ...WINTER_BODY_PARAMS, femurPct: 21.5, torsoPct: 31.8 },
  longFemur: { ...WINTER_BODY_PARAMS, femurPct: 27.5, torsoPct: 25.8 },
  longTibia: { ...WINTER_BODY_PARAMS, tibiaPct: 27, femurPct: 23.3, torsoPct: 27.6 },
  stiffAnkle: { ...WINTER_BODY_PARAMS, ankleDorsiflexionDeg: 20 },
  limitedHip: { ...WINTER_BODY_PARAMS, hipFlexionDeg: 100, hamstringLimitDeg: 65 },
  anteversion: { ...WINTER_BODY_PARAMS, pelvicTiltDeg: 14 },
};

export const DEFAULT_MODEL_A_PRESET: PresetId = "shortFemur";

export const DEFAULT_MODEL_B_PRESET: PresetId = "longFemur";
