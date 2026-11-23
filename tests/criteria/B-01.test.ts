import { describe, expect, it } from "vitest";
import { buildModel } from "../../src/biomechanics/model/buildModel";
import { clampParams } from "../../src/biomechanics/model/clampParams";
import { findPreset } from "../../src/biomechanics/model/findPreset";
import { BODY_PARAM_RANGES, WINTER_BODY_PARAMS } from "../../src/constants/bodyParams";
import { PRESET_IDS, PRESETS } from "../../src/constants/presets";
import { CENTIMETERS_PER_METER, PERCENT, RADIANS_PER_DEGREE } from "../../src/constants/units";
import {
  AVERAGE_HEIGHT_M,
  EXPECTED_PRESETS,
  LENGTH_PRECISION_DIGITS,
  WINTER_FOREARM_TO_ARM,
  WINTER_FRACTIONS,
  WINTER_HEAD_NECK_FRACTION,
  WINTER_MIDFOOT_FOOT_FRACTION,
} from "../constants/anthropometry";

function maxParams() {
  return Object.fromEntries(
    Object.entries(BODY_PARAM_RANGES).map(([key, range]) => [key, range.max]),
  ) as typeof WINTER_BODY_PARAMS;
}

function minParams() {
  return Object.fromEntries(
    Object.entries(BODY_PARAM_RANGES).map(([key, range]) => [key, range.min]),
  ) as typeof WINTER_BODY_PARAMS;
}

describe("B-01 Modelo antropométrico y presets", () => {
  it("[B-01.1][feliz] con el preset Promedio las longitudes coinciden con las fracciones de Winter", () => {
    const model = buildModel(PRESETS.average);
    expect(model.height).toBeCloseTo(AVERAGE_HEIGHT_M, LENGTH_PRECISION_DIGITS);
    for (const [segment, fraction] of Object.entries(WINTER_FRACTIONS)) {
      expect(model.lengths[segment as keyof typeof WINTER_FRACTIONS]).toBeCloseTo(
        fraction * AVERAGE_HEIGHT_M,
        LENGTH_PRECISION_DIGITS,
      );
    }
    expect(model.lengths.headNeck).toBeCloseTo(
      WINTER_HEAD_NECK_FRACTION * AVERAGE_HEIGHT_M,
      LENGTH_PRECISION_DIGITS,
    );
    expect(model.lengths.forearm).toBeCloseTo(
      model.lengths.arm * WINTER_FOREARM_TO_ARM,
      LENGTH_PRECISION_DIGITS,
    );
    expect(model.foot.midfoot).toBeCloseTo(
      WINTER_MIDFOOT_FOOT_FRACTION * model.lengths.foot,
      LENGTH_PRECISION_DIGITS,
    );
    expect(model.foot.heel).toBeLessThan(0);
    expect(model.foot.toe).toBeGreaterThan(model.foot.midfoot);
    expect(model.foot.toe - model.foot.heel).toBeCloseTo(
      model.lengths.foot,
      LENGTH_PRECISION_DIGITS,
    );
    expect(model.limits.ankleDorsiflexionRad).toBeCloseTo(
      WINTER_BODY_PARAMS.ankleDorsiflexionDeg * RADIANS_PER_DEGREE,
      LENGTH_PRECISION_DIGITS,
    );
    expect(model.limits.hipFlexionRad).toBeCloseTo(
      WINTER_BODY_PARAMS.hipFlexionDeg * RADIANS_PER_DEGREE,
      LENGTH_PRECISION_DIGITS,
    );
    expect(model.limits.hamstringLimitRad).toBeCloseTo(
      WINTER_BODY_PARAMS.hamstringLimitDeg * RADIANS_PER_DEGREE,
      LENGTH_PRECISION_DIGITS,
    );
  });

  it("[B-01.1][triste] con otro preset las longitudes siguen sus porcentajes y no las de Winter", () => {
    const model = buildModel(PRESETS.shortFemur);
    expect(model.lengths.femur).toBeCloseTo(
      (EXPECTED_PRESETS.shortFemur.femurPct / PERCENT) * AVERAGE_HEIGHT_M,
      LENGTH_PRECISION_DIGITS,
    );
    expect(model.lengths.femur).not.toBeCloseTo(
      WINTER_FRACTIONS.femur * AVERAGE_HEIGHT_M,
      LENGTH_PRECISION_DIGITS,
    );
    const anteverted = buildModel(PRESETS.anteversion);
    expect(anteverted.pelvicTiltRad).toBeCloseTo(
      EXPECTED_PRESETS.anteversion.pelvicTiltDeg * RADIANS_PER_DEGREE,
      LENGTH_PRECISION_DIGITS,
    );
  });

  it("[B-01.2][feliz] a igual altura cabeza+cuello es lo que sobra y la suma da la altura", () => {
    for (const id of PRESET_IDS) {
      const { height, lengths } = buildModel(PRESETS[id]);
      expect(lengths.headNeck).toBeCloseTo(
        height - lengths.ankleHeight - lengths.tibia - lengths.femur - lengths.torso,
        LENGTH_PRECISION_DIGITS,
      );
      expect(
        lengths.ankleHeight + lengths.tibia + lengths.femur + lengths.torso + lengths.headNeck,
      ).toBeCloseTo(AVERAGE_HEIGHT_M, LENGTH_PRECISION_DIGITS);
    }
    const shortFemur = buildModel(PRESETS.shortFemur).lengths;
    const longFemur = buildModel(PRESETS.longFemur).lengths;
    expect(shortFemur.headNeck).toBeCloseTo(longFemur.headNeck, LENGTH_PRECISION_DIGITS);
  });

  it("[B-01.2][triste] con todos los segmentos al máximo cabeza+cuello se achica pero sigue positiva y no crece la altura", () => {
    const { height, lengths } = buildModel(maxParams());
    expect(lengths.headNeck).toBeGreaterThan(0);
    expect(lengths.headNeck).toBeLessThan(WINTER_HEAD_NECK_FRACTION * height);
    expect(
      lengths.ankleHeight + lengths.tibia + lengths.femur + lengths.torso + lengths.headNeck,
    ).toBeCloseTo(height, LENGTH_PRECISION_DIGITS);
  });

  it("[B-01.3][feliz] existen los 7 presets de la SPEC con sus valores", () => {
    expect([...PRESET_IDS]).toEqual(Object.keys(EXPECTED_PRESETS));
    for (const id of PRESET_IDS) {
      expect(PRESETS[id]).toEqual({ ...WINTER_BODY_PARAMS, ...EXPECTED_PRESETS[id] });
      expect(findPreset(id)).toBe(PRESETS[id]);
    }
  });

  it("[B-01.3][triste] un preset que no existe no se encuentra y ningún preset sale de los rangos", () => {
    expect(findPreset("femurCorto")).toBeUndefined();
    expect(findPreset("")).toBeUndefined();
    for (const id of PRESET_IDS) {
      expect(clampParams(PRESETS[id])).toEqual(PRESETS[id]);
    }
  });

  it("[B-01.4][feliz] un parámetro fuera de rango se ajusta al límite más cercano", () => {
    const above = Object.fromEntries(
      Object.entries(BODY_PARAM_RANGES).map(([key, range]) => [key, range.max + 1]),
    ) as typeof WINTER_BODY_PARAMS;
    const below = Object.fromEntries(
      Object.entries(BODY_PARAM_RANGES).map(([key, range]) => [key, range.min - 1]),
    ) as typeof WINTER_BODY_PARAMS;
    expect(clampParams(above)).toEqual(maxParams());
    expect(clampParams(below)).toEqual(minParams());
    expect(buildModel({ ...WINTER_BODY_PARAMS, heightCm: 300 }).height).toBeCloseTo(
      BODY_PARAM_RANGES.heightCm.max / CENTIMETERS_PER_METER,
      LENGTH_PRECISION_DIGITS,
    );
    expect(clampParams({ ...WINTER_BODY_PARAMS, femurPct: Number.NaN }).femurPct).toBe(
      WINTER_BODY_PARAMS.femurPct,
    );
  });

  it("[B-01.4][triste] los valores dentro del rango, incluidos los límites, se usan tal cual", () => {
    expect(clampParams(maxParams())).toEqual(maxParams());
    expect(clampParams(minParams())).toEqual(minParams());
    const inside = { ...WINTER_BODY_PARAMS, heightCm: 160.5, pelvicTiltDeg: -3.2 };
    expect(clampParams(inside)).toEqual(inside);
  });
});
