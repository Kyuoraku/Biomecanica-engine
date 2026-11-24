import { BODY_PARAM_RANGES, WINTER_BODY_PARAMS } from "../../constants/bodyParams";
import type { BodyParams } from "./bodyParams";

function clampValue(value: number, min: number, max: number, fallback: number): number {
  if (!Number.isFinite(value)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, value));
}

export function clampParams(params: BodyParams): BodyParams {
  const keys = Object.keys(BODY_PARAM_RANGES) as (keyof BodyParams)[];
  return Object.fromEntries(
    keys.map((key) => {
      const { min, max } = BODY_PARAM_RANGES[key];
      return [key, clampValue(params[key], min, max, WINTER_BODY_PARAMS[key])];
    }),
  ) as BodyParams;
}
