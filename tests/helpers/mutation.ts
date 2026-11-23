import { spawnSync } from "node:child_process";
import { resolve } from "node:path";
import {
  MUTATION_BREAK_THRESHOLD,
  MUTATION_TIMEOUT_MS,
  STRYKER_ENTRY,
} from "../constants/mutation";
import { PLAIN_OUTPUT_ENV } from "../constants/tooling";

export type MutationRun = {
  exitCode: number;
  score: number | undefined;
  output: string;
};

const allFilesRowPattern = /All files\s*\|\s*([\d.]+)/;

export function readMutationScore(output: string): number | undefined {
  const match = output.match(allFilesRowPattern);
  return match?.[1] === undefined ? undefined : Number(match[1]);
}

export function meetsMutationThreshold(score: number | undefined): boolean {
  return score === undefined || score >= MUTATION_BREAK_THRESHOLD;
}

export function runMutation(configFile: string): MutationRun {
  const result = spawnSync(process.execPath, [resolve(STRYKER_ENTRY), "run", configFile], {
    encoding: "utf-8",
    timeout: MUTATION_TIMEOUT_MS,
    env: { ...process.env, ...PLAIN_OUTPUT_ENV },
  });
  const output = `${result.stdout}${result.stderr}`;
  return { exitCode: result.status ?? -1, score: readMutationScore(output), output };
}
