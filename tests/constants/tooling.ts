export const VITEST_ENTRY = "node_modules/vitest/vitest.mjs";

export const BIOME_ENTRY = "node_modules/@biomejs/biome/bin/biome";

export const BIOME_CONFIG_FILE = "biome.json";

export const TOOL_TIMEOUT_MS = 60_000;

export const PASSING_TEST_SOURCE =
  'test("adds", () => { if (1 + 1 !== 2) { throw new Error("sum"); } });\n';

export const FAILING_TEST_SOURCE =
  'test("adds", () => { if (1 + 1 !== 3) { throw new Error("sum"); } });\n';

export const CLEAN_SOURCE =
  "export function double(value: number): number {\n  return value * 2;\n}\n";

export const LINT_ERROR_SOURCE =
  "export function double(value: number): number {\n  debugger;\n  return value * 2;\n}\n";

export const LINTED_SOURCE_FILE = "double.ts";
