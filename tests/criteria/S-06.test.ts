import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  EMPTY_TEST_FIXTURE_CONFIG,
  MUTATED_FOLDER_GLOB,
  MUTATION_BREAK_THRESHOLD,
  MUTATION_TIMEOUT_MS,
  STRONG_FIXTURE_CONFIG,
  STRYKER_CONFIG_FILE,
} from "../constants/mutation";
import { FEATURE_LIST_FILE } from "../constants/traceability";
import {
  completeTags,
  featureInReview,
  pendingFeature,
  sourceWithTaggedTests,
  strykerOutputBelowThreshold,
  tagsWithoutSadCase,
  tagsWithUnknownCriterion,
} from "../fixtures/S-06/traceability";
import { meetsMutationThreshold, readMutationScore, runMutation } from "../helpers/mutation";
import {
  collectTestTags,
  extractTestTags,
  type Feature,
  findTraceabilityProblems,
} from "../helpers/traceability";

const features: Feature[] = JSON.parse(readFileSync(FEATURE_LIST_FILE, "utf-8")).features;

describe("S-06 Tests de los tests", () => {
  it("[S-06.1][feliz] la trazabilidad pasa: cada criterio de las features en progreso, review o hechas tiene test feliz y triste", () => {
    expect(findTraceabilityProblems(features, collectTestTags())).toEqual([]);
    expect(findTraceabilityProblems([featureInReview, pendingFeature], completeTags)).toEqual([]);
    expect(extractTestTags(sourceWithTaggedTests)).toEqual([
      { criterion: "Z-01.1", testCase: "feliz" },
      { criterion: "Z-01.1", testCase: "triste" },
      { criterion: "Z-01.2", testCase: "evidencia" },
    ]);
  });

  it("[S-06.1][triste] una feature pendiente sin tests no hace fallar la trazabilidad, pero en review sí", () => {
    expect(findTraceabilityProblems([pendingFeature], [])).toEqual([]);
    expect(findTraceabilityProblems([{ ...pendingFeature, estado: "en_progreso" }], [])).toEqual([
      "missing Z-02.1 feliz",
      "missing Z-02.1 triste",
    ]);
  });

  it("[S-06.2][feliz] la trazabilidad falla con una feature sin test triste o un test que apunta a un criterio inexistente", () => {
    expect(findTraceabilityProblems([featureInReview], tagsWithoutSadCase)).toEqual([
      "missing Z-01.2 triste",
    ]);
    expect(findTraceabilityProblems([featureInReview], tagsWithUnknownCriterion)).toEqual([
      "unknown X-99.1",
    ]);
  });

  it("[S-06.2][triste] con todos los tests y ninguno huérfano la trazabilidad no reporta problemas", () => {
    expect(findTraceabilityProblems([featureInReview], completeTags)).toEqual([]);
  });

  it(
    "[S-06.3][feliz] la mutación de src/biomechanics corre con umbral de 80 % y un código bien probado lo supera",
    () => {
      const config = JSON.parse(readFileSync(STRYKER_CONFIG_FILE, "utf-8"));
      expect(config.mutate).toEqual([MUTATED_FOLDER_GLOB]);
      expect(config.thresholds.break).toBe(MUTATION_BREAK_THRESHOLD);
      expect(runMutation(STRYKER_CONFIG_FILE).exitCode).toBe(0);
      const strong = runMutation(STRONG_FIXTURE_CONFIG);
      expect(strong.exitCode).toBe(0);
      expect(strong.score).toBeGreaterThanOrEqual(MUTATION_BREAK_THRESHOLD);
    },
    MUTATION_TIMEOUT_MS,
  );

  it("[S-06.3][triste] un puntaje de 79,99 % no supera el umbral", () => {
    const score = readMutationScore(strykerOutputBelowThreshold);
    expect(score).toBe(79.99);
    expect(meetsMutationThreshold(score)).toBe(false);
  });

  it(
    "[S-06.4][feliz] un fixture con un test vacío queda por debajo del umbral y el chequeo falla",
    () => {
      const empty = runMutation(EMPTY_TEST_FIXTURE_CONFIG);
      expect(empty.exitCode).not.toBe(0);
      expect(empty.score).toBeLessThan(MUTATION_BREAK_THRESHOLD);
    },
    MUTATION_TIMEOUT_MS,
  );

  it(
    "[S-06.4][triste] el mismo código con tests que verifican algo no falla el chequeo",
    () => {
      expect(meetsMutationThreshold(runMutation(STRONG_FIXTURE_CONFIG).score)).toBe(true);
    },
    MUTATION_TIMEOUT_MS,
  );
});
