export const LENGTH_PRECISION_DIGITS = 9;

export const WINTER_FRACTIONS = {
  ankleHeight: 0.039,
  foot: 0.152,
  tibia: 0.246,
  femur: 0.245,
  torso: 0.288,
  arm: 0.186,
} as const;

export const WINTER_HEAD_NECK_FRACTION = 0.182;

export const WINTER_FOREARM_TO_ARM = 1.05;

export const WINTER_MIDFOOT_FOOT_FRACTION = 0.2;

export const AVERAGE_HEIGHT_M = 1.75;

export const EXPECTED_PRESETS = {
  average: { femurPct: 24.5, tibiaPct: 24.6, torsoPct: 28.8 },
  shortFemur: { femurPct: 21.5, torsoPct: 31.8 },
  longFemur: { femurPct: 27.5, torsoPct: 25.8 },
  longTibia: { tibiaPct: 27, femurPct: 23.3, torsoPct: 27.6 },
  stiffAnkle: { ankleDorsiflexionDeg: 20 },
  limitedHip: { hipFlexionDeg: 100, hamstringLimitDeg: 65 },
  anteversion: { pelvicTiltDeg: 14 },
} as const;
