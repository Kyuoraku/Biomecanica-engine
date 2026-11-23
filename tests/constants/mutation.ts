export const STRYKER_ENTRY = "node_modules/@stryker-mutator/core/bin/stryker.js";

export const STRYKER_CONFIG_FILE = "stryker.config.json";

export const MUTATION_BREAK_THRESHOLD = 80;

export const MUTATED_FOLDER_GLOB = "src/biomechanics/**/*.ts";

export const MUTATION_EXCLUDED_TESTS = [
  "**/node_modules/**",
  "tests/criteria/S-02.test.ts",
  "tests/criteria/S-03.test.ts",
  "tests/criteria/S-06.test.ts",
] as const;

export const STRONG_FIXTURE_CONFIG = "tests/fixtures/S-06/mutation/strong.stryker.json";

export const EMPTY_TEST_FIXTURE_CONFIG = "tests/fixtures/S-06/mutation/empty.stryker.json";

export const MUTATION_TIMEOUT_MS = 180_000;
