import { expect, test } from "@playwright/test";
import es from "../../src/locales/es.json" with { type: "json" };
import { captureEvidence } from "../helpers/evidence";

test("[S-01.1][evidencia] la app levanta y muestra la página inicial", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(es.home.title);
  await captureEvidence(page, testInfo, "S-01", "S-01.1-pagina-inicial");
});

test("[S-01.2][evidencia] los textos de la página inicial son los de es.json", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  await expect(page.getByText(es.home.subtitle)).toBeVisible();
  const hasHorizontalScroll = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalScroll).toBe(false);
  await captureEvidence(page, testInfo, "S-01", "S-01.2-textos-desde-locales");
});
