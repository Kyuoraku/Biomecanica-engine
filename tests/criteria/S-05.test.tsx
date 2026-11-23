import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LANGUAGE_STORAGE_KEY } from "../../src/constants/i18n";
import { activeLanguage, createTranslator } from "../../src/i18n/createTranslator";
import { formatNumber } from "../../src/i18n/formatNumber";
import en from "../../src/locales/en.json";
import es from "../../src/locales/es.json";
import { App } from "../../src/ui/App";
import { CODE_FILE_EXTENSIONS, SOURCE_ROOT } from "../constants/architecture";
import { englishMissingKey, sourceUsingMissingKeys, spanishWithExtraKey } from "../fixtures/S-05";
import { stubBrowserLanguages } from "../helpers/browser";
import {
  collectUsedKeys,
  extractUsedKeys,
  findKeyDifferences,
  findMissingKeys,
  findUnusedKeys,
} from "../helpers/locales";

function renderApp() {
  const translator = createTranslator({ document });
  return { translator, ...render(<App translator={translator} />) };
}

describe("S-05 Idiomas: español e inglés", () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
    document.documentElement.lang = "";
  });

  it("[S-05.1][feliz] con el navegador en inglés y sin elección previa la app abre en inglés", () => {
    stubBrowserLanguages(["en-US", "en"]);
    renderApp();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(en.home.title);
    expect(document.documentElement.lang).toBe("en");
  });

  it("[S-05.1][triste] con el navegador en inglés y una elección previa de español la app abre en español", () => {
    stubBrowserLanguages(["en-US", "en"]);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, "es");
    renderApp();
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(es.home.title);
  });

  it("[S-05.2][feliz] con el navegador en un idioma no soportado la app abre en español", () => {
    stubBrowserLanguages(["fr-FR", "fr"]);
    const { translator } = renderApp();
    expect(activeLanguage(translator)).toBe("es");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(es.home.title);
  });

  it("[S-05.2][triste] una elección guardada inválida se ignora y con navegador no soportado sigue en español", () => {
    stubBrowserLanguages(["pt-BR"]);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, "de");
    const { translator } = renderApp();
    expect(activeLanguage(translator)).toBe("es");
  });

  it("[S-05.3][feliz] elegir inglés cambia todos los textos al instante sin recargar ni volver a montar la página", async () => {
    stubBrowserLanguages(["es-AR"]);
    const { container } = renderApp();
    const header = container.querySelector("header");
    const location = window.location.href;
    await act(async () => {
      fireEvent.change(screen.getByRole("combobox"), { target: { value: "en" } });
    });
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(en.home.title);
    expect(screen.getByText(en.home.subtitle)).toBeTruthy();
    expect(screen.getByText(en.language.label)).toBeTruthy();
    expect(container.querySelector("header")).toBe(header);
    expect(window.location.href).toBe(location);
    expect(document.documentElement.lang).toBe("en");
  });

  it("[S-05.3][triste] un valor de idioma no soportado en el desplegable no cambia nada", async () => {
    stubBrowserLanguages(["es-AR"]);
    const { translator } = renderApp();
    await act(async () => {
      fireEvent.change(screen.getByRole("combobox"), { target: { value: "fr" } });
    });
    expect(activeLanguage(translator)).toBe("es");
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(es.home.title);
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBeNull();
  });

  it("[S-05.4][feliz] la elección se recuerda al volver a entrar", async () => {
    stubBrowserLanguages(["es-AR"]);
    const { unmount } = renderApp();
    await act(async () => {
      fireEvent.change(screen.getByRole("combobox"), { target: { value: "en" } });
    });
    unmount();
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("en");
    expect(activeLanguage(createTranslator())).toBe("en");
  });

  it("[S-05.4][triste] si el usuario no elige, no se guarda nada y la próxima visita sigue al navegador", () => {
    stubBrowserLanguages(["en-GB"]);
    renderApp().unmount();
    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBeNull();
    stubBrowserLanguages(["es-MX"]);
    expect(activeLanguage(createTranslator())).toBe("es");
  });

  it("[S-05.5][feliz] es.json y en.json tienen las mismas claves y el código usa todas y solo esas", () => {
    expect(findKeyDifferences(es, en)).toEqual([]);
    const used = collectUsedKeys(SOURCE_ROOT, CODE_FILE_EXTENSIONS);
    expect(used.exact.length).toBeGreaterThan(0);
    expect(findMissingKeys(used, es)).toEqual([]);
    expect(findUnusedKeys(used, es)).toEqual([]);
  });

  it("[S-05.5][triste] una clave de más, una de menos o una usada que no existe se detectan", () => {
    expect(findKeyDifferences(spanishWithExtraKey, englishMissingKey)).toEqual(["home.subtitle"]);
    const used = extractUsedKeys(sourceUsingMissingKeys);
    expect(findMissingKeys(used, es)).toEqual(["menu.open", "exercises.names."]);
    expect(findUnusedKeys({ exact: [], prefixes: [] }, englishMissingKey)).toEqual([
      "home.title",
      "language.label",
    ]);
  });

  it("[S-05.6][feliz] los números usan coma decimal en español y punto en inglés", () => {
    expect(formatNumber(12.5, "es", 1)).toBe("12,5");
    expect(formatNumber(12.5, "en", 1)).toBe("12.5");
  });

  it("[S-05.6][triste] el español no usa punto decimal ni el inglés coma decimal", () => {
    expect(formatNumber(0.25, "es", 2)).not.toContain(".");
    expect(formatNumber(0.25, "en", 2)).not.toContain(",");
  });
});
