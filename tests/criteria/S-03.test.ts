import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import packageJson from "../../package.json";
import {
  BUILD_SCRIPT,
  MAIN_BRANCH,
  NETLIFY_CONFIG_FILE,
  NETWORK_TIMEOUT_MS,
  REPOSITORY_SLUG,
} from "../constants/deploy";
import {
  deployConfigWithWrongOutput,
  protectedBranchWithoutChecks,
  unprotectedBranch,
} from "../fixtures/S-03";
import {
  fetchBranch,
  findDeployConfigProblems,
  isProtectedAgainstDirectPush,
} from "../helpers/deploy";

describe("S-03 Repo remoto y deploy", () => {
  it("[S-03.1][feliz] el deploy de Netlify construye el sitio estático con el build del proyecto", () => {
    expect(findDeployConfigProblems(readFileSync(NETLIFY_CONFIG_FILE, "utf-8"))).toEqual([]);
    expect(packageJson.scripts[BUILD_SCRIPT]).toContain("vite build");
  });

  it("[S-03.1][triste] una configuración que publica otra carpeta, con otro build o sin Node fijo se rechaza", () => {
    expect(findDeployConfigProblems(deployConfigWithWrongOutput)).toEqual([
      "command",
      "publish",
      "node",
    ]);
  });

  it(
    "[S-03.2][feliz] la rama principal del repo remoto está protegida y exige el CI",
    async () => {
      const branch = await fetchBranch(REPOSITORY_SLUG, MAIN_BRANCH);
      expect(isProtectedAgainstDirectPush(branch)).toBe(true);
    },
    NETWORK_TIMEOUT_MS,
  );

  it("[S-03.2][triste] una rama sin protección o protegida sin el CI obligatorio no cuenta como protegida", () => {
    expect(isProtectedAgainstDirectPush(unprotectedBranch)).toBe(false);
    expect(isProtectedAgainstDirectPush(protectedBranchWithoutChecks)).toBe(false);
  });
});
