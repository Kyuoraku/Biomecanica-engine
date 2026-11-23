import { expect, test } from "@playwright/test";
import { SOFTWARE_RENDERER_PATTERN } from "../constants/evidence";
import { captureEvidence, writeEvidenceData } from "../helpers/evidence";
import { readWebGlRenderer } from "../helpers/webgl";

test("[S-02.3][evidencia] las capturas usan WebGL por software en el viewport del proyecto", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  const renderer = await readWebGlRenderer(page);
  expect(renderer).toMatch(SOFTWARE_RENDERER_PATTERN);
  writeEvidenceData(testInfo, "S-02", "S-02.3-webgl-por-software", {
    renderer,
    viewport: page.viewportSize(),
  });
  await captureEvidence(page, testInfo, "S-02", "S-02.3-webgl-por-software", false);
});
