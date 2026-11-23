import { mkdirSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { createTranslator, MissingTranslationError } from "../../src/i18n/createTranslator";
import en from "../../src/locales/en.json";
import es from "../../src/locales/es.json";
import { App } from "../../src/ui/App";
import { MissingRootElementError, mountApp } from "../../src/ui/mountApp";
import {
  BIOMECHANICS_FOLDER,
  COMPONENT_FILE_EXTENSION,
  REQUIRED_SOURCE_FOLDERS,
  SOURCE_ROOT,
} from "../constants/architecture";
import {
  biomechanicsSourceWithLayerImports,
  biomechanicsSourceWithPureImports,
  componentWithHardcodedText,
  componentWithTranslatedText,
} from "../fixtures/S-01";
import {
  findForbiddenBiomechanicsImports,
  findForbiddenImportsInFolder,
  findHardcodedText,
  findMissingFolders,
  listFiles,
} from "../helpers/architecture";

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") {
    return [value];
  }
  return Object.values(value as Record<string, unknown>).flatMap(collectStrings);
}

describe("S-01 Proyecto base", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("[S-01.1][feliz] la app se monta en #root y muestra la página inicial", () => {
    document.body.innerHTML = '<div id="root"></div>';
    let root: ReturnType<typeof mountApp> | undefined;
    act(() => {
      root = mountApp(document);
    });
    expect(document.querySelector("h1")?.textContent).toBe(es.home.title);
    expect(document.querySelector("p")?.textContent).toBe(es.home.subtitle);
    act(() => root?.unmount());
  });

  it("[S-01.1][triste] sin el elemento #root la app no se monta y avisa por qué", () => {
    document.body.innerHTML = '<div id="other"></div>';
    expect(() => mountApp(document)).toThrow(MissingRootElementError);
  });

  it("[S-01.2][feliz] todo el texto visible sale de locales/ y ningún componente tiene texto escrito", () => {
    const { container } = render(<App translator={createTranslator("en")} />);
    const visibleTexts = [...container.querySelectorAll("h1, p")].map((node) => node.textContent);
    const localeTexts = collectStrings(en);
    expect(visibleTexts.length).toBeGreaterThan(0);
    for (const text of visibleTexts) {
      expect(localeTexts).toContain(text);
    }
    const components = listFiles(SOURCE_ROOT, [COMPONENT_FILE_EXTENSION]);
    expect(components.length).toBeGreaterThan(0);
    for (const path of components) {
      expect(findHardcodedText(readFileSync(path, "utf-8")), path).toEqual([]);
    }
    expect(findHardcodedText(componentWithTranslatedText)).toEqual([]);
  });

  it("[S-01.2][triste] un texto escrito en un componente o una clave faltante se detectan", () => {
    expect(findHardcodedText(componentWithHardcodedText)).toEqual(["Hola mundo", "Esqueleto"]);
    const translator = createTranslator("es");
    expect(() => translator.t("home.missing")).toThrow(MissingTranslationError);
  });

  it("[S-01.3][feliz] existen las carpetas de las tres capas y el motor no importa escena ni UI", () => {
    expect(findMissingFolders(".", REQUIRED_SOURCE_FOLDERS)).toEqual([]);
    expect(findForbiddenImportsInFolder(BIOMECHANICS_FOLDER)).toEqual([]);
    expect(findForbiddenBiomechanicsImports(biomechanicsSourceWithPureImports)).toEqual([]);
  });

  it("[S-01.3][triste] un import de escena, UI, three o react desde el motor y una carpeta faltante se detectan", () => {
    expect(findForbiddenBiomechanicsImports(biomechanicsSourceWithLayerImports)).toEqual([
      "../scene/rig/Rig",
      "../../ui/components/Panel",
      "three",
      "react",
      "../ui/helper",
      "../scene/lazy",
    ]);
    const root = mkdtempSync(join(tmpdir(), "s01-"));
    mkdirSync(join(root, "src", "biomechanics"), { recursive: true });
    expect(findMissingFolders(root, REQUIRED_SOURCE_FOLDERS)).toEqual(
      REQUIRED_SOURCE_FOLDERS.filter((folder) => folder !== "src/biomechanics"),
    );
  });
});
