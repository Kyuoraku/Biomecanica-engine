import { expect, test } from "@playwright/test";
import en from "../../src/locales/en.json" with { type: "json" };
import es from "../../src/locales/es.json" with { type: "json" };
import { captureEvidence } from "../helpers/evidence";

test.describe("navegador en inglés", () => {
  test.use({ locale: "en-US" });

  test("[S-05.1][evidencia] sin elección previa la app abre en inglés", async ({
    page,
  }, testInfo) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(en.home.title);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await captureEvidence(page, testInfo, "S-05", "S-05.1-navegador-en-ingles");
  });
});

test.describe("navegador en francés", () => {
  test.use({ locale: "fr-FR" });

  test("[S-05.2][evidencia] con un idioma no soportado la app abre en español", async ({
    page,
  }, testInfo) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(es.home.title);
    await captureEvidence(page, testInfo, "S-05", "S-05.2-idioma-no-soportado-espanol");
  });
});

test.describe("navegador en español", () => {
  test.use({ locale: "es-AR" });

  test("[S-05.3][evidencia] el desplegable cambia los textos al instante", async ({
    page,
  }, testInfo) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(es.home.title);
    await page.getByRole("combobox").selectOption("en");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(en.home.title);
    await captureEvidence(page, testInfo, "S-05", "S-05.3-cambio-a-ingles");
  });

  test("[S-05.4][evidencia] la elección se recuerda al volver a entrar", async ({
    page,
  }, testInfo) => {
    await page.goto("/");
    await page.getByRole("combobox").selectOption("en");
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(en.home.title);
    await expect(page.getByRole("combobox")).toHaveValue("en");
    await captureEvidence(page, testInfo, "S-05", "S-05.4-eleccion-recordada");
  });
});
