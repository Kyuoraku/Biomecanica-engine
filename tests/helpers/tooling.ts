import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import {
  BIOME_CONFIG_FILE,
  BIOME_ENTRY,
  PLAIN_OUTPUT_ENV,
  TOOL_TIMEOUT_MS,
  VITEST_ENTRY,
} from "../constants/tooling";

export type ToolResult = {
  exitCode: number;
  output: string;
};

function runNodeTool(entry: string, args: string[], cwd: string): ToolResult {
  const result = spawnSync(process.execPath, [resolve(entry), ...args], {
    cwd,
    encoding: "utf-8",
    timeout: TOOL_TIMEOUT_MS,
    env: { ...process.env, ...PLAIN_OUTPUT_ENV },
  });
  return { exitCode: result.status ?? -1, output: `${result.stdout}${result.stderr}` };
}

export function createProject(files: Record<string, string>): string {
  const root = mkdtempSync(join(tmpdir(), "biomecanica-"));
  for (const [name, content] of Object.entries(files)) {
    writeFileSync(join(root, name), content);
  }
  return root;
}

export function isolatedBiomeConfig(): string {
  const { $schema: _schema, ...config } = JSON.parse(readFileSync(BIOME_CONFIG_FILE, "utf-8"));
  return JSON.stringify({ ...config, vcs: { enabled: false } });
}

export function runTests(projectRoot: string): ToolResult {
  return runNodeTool(VITEST_ENTRY, ["run", "--root", projectRoot, "--globals"], projectRoot);
}

export function runLint(projectRoot: string, target = "."): ToolResult {
  return runNodeTool(BIOME_ENTRY, ["check", target], projectRoot);
}
