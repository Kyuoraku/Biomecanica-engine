import type { Page, TestInfo } from "@playwright/test";
import { SCREENSHOTS_FOLDER } from "../constants/evidence";

export async function captureEvidence(
  page: Page,
  testInfo: TestInfo,
  featureId: string,
  name: string,
): Promise<void> {
  await page.screenshot({
    path: `${SCREENSHOTS_FOLDER}/${featureId}/${name}-${testInfo.project.name}.png`,
    fullPage: true,
  });
}
