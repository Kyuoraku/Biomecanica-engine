import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/fixtures/S-06/mutation/empty.check.ts"],
  },
});
