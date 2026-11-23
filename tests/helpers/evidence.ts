import { mkdirSync, writeFileSync } from "node:fs";
import type { Page, TestInfo } from "@playwright/test";
import { SCREENSHOTS_FOLDER } from "../constants/evidence";

function evidencePath(testInfo: TestInfo, featureId: string, name: string, extension: string) {
  return `${SCREENSHOTS_FOLDER}/${featureId}/${name}-${testInfo.project.name}.${extension}`;
}

export async function captureEvidence(
  page: Page,
  testInfo: TestInfo,
  featureId: string,
  name: string,
  fullPage = true,
): Promise<void> {
  await page.screenshot({ path: evidencePath(testInfo, featureId, name, "png"), fullPage });
}

export function writeEvidenceData(
  testInfo: TestInfo,
  featureId: string,
  name: string,
  data: unknown,
): void {
  mkdirSync(`${SCREENSHOTS_FOLDER}/${featureId}`, { recursive: true });
  writeFileSync(
    evidencePath(testInfo, featureId, name, "json"),
    `${JSON.stringify(data, null, 2)}\n`,
  );
}
