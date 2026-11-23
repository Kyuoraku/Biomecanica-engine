import { parse } from "smol-toml";
import {
  BUILD_SCRIPT,
  GITHUB_API_URL,
  PACKAGE_MANAGER,
  REQUIRED_NODE_MAJOR,
  REQUIRED_STATUS_CHECK,
  VITE_OUTPUT_FOLDER,
} from "../constants/deploy";

type NetlifyConfig = {
  build?: {
    command?: string;
    publish?: string;
    environment?: Record<string, string>;
  };
};

export type BranchSummary = {
  protected: boolean;
  protection?: {
    enabled?: boolean;
    required_status_checks?: { contexts?: string[] };
  };
};

export function findDeployConfigProblems(source: string): string[] {
  const config = parse(source) as NetlifyConfig;
  const problems: string[] = [];
  if (config.build?.command !== `${PACKAGE_MANAGER} ${BUILD_SCRIPT}`) {
    problems.push("command");
  }
  if (config.build?.publish !== VITE_OUTPUT_FOLDER) {
    problems.push("publish");
  }
  if (config.build?.environment?.NODE_VERSION !== REQUIRED_NODE_MAJOR) {
    problems.push("node");
  }
  return problems;
}

export function isProtectedAgainstDirectPush(branch: BranchSummary): boolean {
  return (
    branch.protected &&
    branch.protection?.enabled === true &&
    (branch.protection.required_status_checks?.contexts ?? []).includes(REQUIRED_STATUS_CHECK)
  );
}

export async function fetchBranch(repository: string, branch: string): Promise<BranchSummary> {
  const token = process.env.GITHUB_TOKEN;
  const response = await fetch(`${GITHUB_API_URL}/repos/${repository}/branches/${branch}`, {
    headers: token ? { authorization: `Bearer ${token}` } : {},
  });
  if (!response.ok) {
    throw new Error(`GitHub API responded ${response.status}`);
  }
  return (await response.json()) as BranchSummary;
}
