import { readFileSync } from "node:fs";
import { CODE_FILE_EXTENSIONS } from "../constants/architecture";
import {
  REQUIRED_CASES,
  TEST_TAG_PATTERN,
  TRACED_TEST_FOLDERS,
  TRACKED_FEATURE_STATES,
} from "../constants/traceability";
import { listFiles } from "./architecture";

export type Feature = {
  id: string;
  estado: string;
  criterios_aceptacion: string[];
};

export type TestTag = {
  criterion: string;
  testCase: string;
};

export function extractTestTags(source: string): TestTag[] {
  return [...source.matchAll(TEST_TAG_PATTERN)].map((match) => ({
    criterion: `${match[1]}.${match[2]}`,
    testCase: match[3] ?? "",
  }));
}

export function collectTestTags(root = "."): TestTag[] {
  return TRACED_TEST_FOLDERS.flatMap((folder) =>
    listFiles(`${root}/${folder}`, CODE_FILE_EXTENSIONS),
  ).flatMap((path) => extractTestTags(readFileSync(path, "utf-8")));
}

function criterionIds(feature: Feature): string[] {
  return feature.criterios_aceptacion.map((_, index) => `${feature.id}.${index + 1}`);
}

export function findTraceabilityProblems(features: Feature[], tags: TestTag[]): string[] {
  const tracked = features.filter((feature) =>
    TRACKED_FEATURE_STATES.some((state) => state === feature.estado),
  );
  const missing = tracked
    .flatMap(criterionIds)
    .flatMap((criterion) =>
      REQUIRED_CASES.filter(
        (testCase) => !tags.some((tag) => tag.criterion === criterion && tag.testCase === testCase),
      ).map((testCase) => `missing ${criterion} ${testCase}`),
    );
  const existing = new Set(features.flatMap(criterionIds));
  const unknown = [
    ...new Set(tags.filter((tag) => !existing.has(tag.criterion)).map((tag) => tag.criterion)),
  ].map((criterion) => `unknown ${criterion}`);
  return [...missing, ...unknown];
}
