import type { BodyParams } from "../biomechanics/model/bodyParams";

export type ParamRange = {
  min: number;
  max: number;
};

export const BODY_PARAM_RANGES: Record<keyof BodyParams, ParamRange> = {
  heightCm: { min: 145, max: 205 },
  femurPct: { min: 19, max: 30 },
  tibiaPct: { min: 20, max: 29 },
  torsoPct: { min: 23, max: 34 },
  armPct: { min: 15, max: 22 },
  ankleDorsiflexionDeg: { min: 5, max: 50 },
  hipFlexionDeg: { min: 85, max: 140 },
  hamstringLimitDeg: { min: 45, max: 115 },
  pelvicTiltDeg: { min: -12, max: 22 },
};

export const WINTER_BODY_PARAMS: BodyParams = {
  heightCm: 175,
  femurPct: 24.5,
  tibiaPct: 24.6,
  torsoPct: 28.8,
  armPct: 18.6,
  ankleDorsiflexionDeg: 35,
  hipFlexionDeg: 125,
  hamstringLimitDeg: 85,
  pelvicTiltDeg: 0,
};
