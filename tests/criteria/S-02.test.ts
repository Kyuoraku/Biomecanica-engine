import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  GPU_RENDERER_EXAMPLE,
  SCREENSHOTS_FOLDER,
  SOFTWARE_RENDERER_PATTERN,
  VIEWPORTS_BY_PROJECT,
} from "../constants/evidence";
import {
  CLEAN_SOURCE,
  FAILING_TEST_SOURCE,
  LINT_ERROR_SOURCE,
  LINTED_SOURCE_FILE,
  PASSING_TEST_SOURCE,
  TOOL_TIMEOUT_MS,
} from "../constants/tooling";
import { NotPngError, readPngSize } from "../helpers/png";
import { createProject, isolatedBiomeConfig, runLint, runTests } from "../helpers/tooling";

const evidenceFolder = join(SCREENSHOTS_FOLDER, "S-02");

function evidenceFile(project: string, extension: string): string {
  return join(evidenceFolder, `S-02.3-webgl-por-software-${project}.${extension}`);
}

describe("S-02 Calidad: lint, tests y evidencia", () => {
  it(
    "[S-02.1][feliz] el comando de tests corre y pasa con al menos un test",
    () => {
      const result = runTests(createProject({ "sum.test.js": PASSING_TEST_SOURCE }));
      expect(result.exitCode).toBe(0);
      expect(result.output).toMatch(/Tests\s+1 passed/);
    },
    TOOL_TIMEOUT_MS,
  );

  it(
    "[S-02.1][triste] sin tests o con un test que falla el comando de tests falla",
    () => {
      expect(runTests(createProject({})).exitCode).not.toBe(0);
      expect(runTests(createProject({ "sum.test.js": FAILING_TEST_SOURCE })).exitCode).not.toBe(0);
    },
    TOOL_TIMEOUT_MS,
  );

  it(
    "[S-02.2][feliz] el lint corre sin errores sobre el repo y sobre código limpio",
    () => {
      expect(runLint(".").exitCode).toBe(0);
      const project = createProject({
        "biome.json": isolatedBiomeConfig(),
        [LINTED_SOURCE_FILE]: CLEAN_SOURCE,
      });
      expect(runLint(project, LINTED_SOURCE_FILE).exitCode).toBe(0);
    },
    TOOL_TIMEOUT_MS,
  );

  it(
    "[S-02.2][triste] el lint falla con código que rompe una regla",
    () => {
      const project = createProject({
        "biome.json": isolatedBiomeConfig(),
        [LINTED_SOURCE_FILE]: LINT_ERROR_SOURCE,
      });
      const result = runLint(project, LINTED_SOURCE_FILE);
      expect(result.exitCode).not.toBe(0);
      expect(result.output).toContain("noDebugger");
    },
    TOOL_TIMEOUT_MS,
  );

  it("[S-02.3][feliz] hay capturas en screenshots/S-02/ en 1400×1000 y 390×844 con WebGL por software", () => {
    for (const [project, viewport] of Object.entries(VIEWPORTS_BY_PROJECT)) {
      expect(readPngSize(evidenceFile(project, "png"))).toEqual(viewport);
      const data = JSON.parse(readFileSync(evidenceFile(project, "json"), "utf-8"));
      expect(data.renderer).toMatch(SOFTWARE_RENDERER_PATTERN);
      expect(data.viewport).toEqual(viewport);
    }
  });

  it("[S-02.3][triste] una captura de otro tamaño, un archivo que no es PNG o un renderer por GPU se rechazan", () => {
    expect(readPngSize(evidenceFile("desktop", "png"))).not.toEqual(VIEWPORTS_BY_PROJECT.phone);
    expect(() => readPngSize(evidenceFile("desktop", "json"))).toThrow(NotPngError);
    expect(GPU_RENDERER_EXAMPLE).not.toMatch(SOFTWARE_RENDERER_PATTERN);
  });
});
