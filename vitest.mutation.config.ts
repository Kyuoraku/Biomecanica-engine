import { defineConfig, mergeConfig } from "vitest/config";
import { MUTATION_EXCLUDED_TESTS } from "./tests/constants/mutation";
import baseConfig from "./vite.config";

export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      exclude: [...MUTATION_EXCLUDED_TESTS],
    },
  }),
);
