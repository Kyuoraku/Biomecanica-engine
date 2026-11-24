import {
  ANKLE_HEIGHT_FRACTION,
  FOOT_LENGTH_FRACTION,
  FOREARM_TO_ARM_RATIO,
  HEEL_BEHIND_ANKLE_FOOT_FRACTION,
  MIDFOOT_AHEAD_OF_ANKLE_FOOT_FRACTION,
  TOE_AHEAD_OF_ANKLE_FOOT_FRACTION,
} from "../../constants/anthropometry";
import { CENTIMETERS_PER_METER, PERCENT, RADIANS_PER_DEGREE } from "../../constants/units";
import type { BodyModel } from "./bodyModel";
import type { BodyParams } from "./bodyParams";
import { clampParams } from "./clampParams";

export function buildModel(params: BodyParams): BodyModel {
  const safe = clampParams(params);
  const height = safe.heightCm / CENTIMETERS_PER_METER;
  const ankleHeight = ANKLE_HEIGHT_FRACTION * height;
  const tibia = (safe.tibiaPct / PERCENT) * height;
  const femur = (safe.femurPct / PERCENT) * height;
  const torso = (safe.torsoPct / PERCENT) * height;
  const arm = (safe.armPct / PERCENT) * height;
  const foot = FOOT_LENGTH_FRACTION * height;
  return {
    height,
    lengths: {
      ankleHeight,
      foot,
      tibia,
      femur,
      torso,
      headNeck: height - ankleHeight - tibia - femur - torso,
      arm,
      forearm: arm * FOREARM_TO_ARM_RATIO,
    },
    foot: {
      heel: -HEEL_BEHIND_ANKLE_FOOT_FRACTION * foot,
      midfoot: MIDFOOT_AHEAD_OF_ANKLE_FOOT_FRACTION * foot,
      toe: TOE_AHEAD_OF_ANKLE_FOOT_FRACTION * foot,
    },
    limits: {
      ankleDorsiflexionRad: safe.ankleDorsiflexionDeg * RADIANS_PER_DEGREE,
      hipFlexionRad: safe.hipFlexionDeg * RADIANS_PER_DEGREE,
      hamstringLimitRad: safe.hamstringLimitDeg * RADIANS_PER_DEGREE,
    },
    pelvicTiltRad: safe.pelvicTiltDeg * RADIANS_PER_DEGREE,
  };
}
