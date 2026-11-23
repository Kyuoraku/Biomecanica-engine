import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  CODE_FILE_EXTENSIONS,
  FORBIDDEN_BIOMECHANICS_IMPORTS,
  USER_FACING_ATTRIBUTES,
} from "../constants/architecture";

const importSpecifierPattern =
  /(?:import|export)\s[^"']*?from\s*["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)|import\s+["']([^"']+)["']/g;

const jsxTextPattern = />([^<>{}]*\p{L}[^<>{}]*)</gu;

export function listFiles(folder: string, extensions: readonly string[]): string[] {
  if (!existsSync(folder)) {
    return [];
  }
  return readdirSync(folder).flatMap((entry) => {
    const path = join(folder, entry);
    if (statSync(path).isDirectory()) {
      return listFiles(path, extensions);
    }
    return extensions.some((extension) => path.endsWith(extension)) ? [path] : [];
  });
}

export function findMissingFolders(root: string, folders: readonly string[]): string[] {
  return folders.filter((folder) => {
    const path = join(root, folder);
    return !existsSync(path) || !statSync(path).isDirectory();
  });
}

export function extractImportSpecifiers(source: string): string[] {
  return [...source.matchAll(importSpecifierPattern)].map(
    (match) => match[1] ?? match[2] ?? match[3] ?? "",
  );
}

export function findForbiddenBiomechanicsImports(source: string): string[] {
  return extractImportSpecifiers(source).filter((specifier) =>
    FORBIDDEN_BIOMECHANICS_IMPORTS.some((pattern) => pattern.test(specifier)),
  );
}

export function findForbiddenImportsInFolder(folder: string): string[] {
  return listFiles(folder, CODE_FILE_EXTENSIONS).flatMap((path) =>
    findForbiddenBiomechanicsImports(readFileSync(path, "utf-8")).map(
      (specifier) => `${path}: ${specifier}`,
    ),
  );
}

export function findHardcodedText(source: string): string[] {
  const jsxTexts = [...source.matchAll(jsxTextPattern)]
    .map((match) => (match[1] ?? "").trim())
    .filter((text) => text.length > 0);
  const attributeTexts = USER_FACING_ATTRIBUTES.flatMap((attribute) =>
    [...source.matchAll(new RegExp(String.raw`${attribute}="([^"]*\p{L}[^"]*)"`, "gu"))].map(
      (match) => match[1] ?? "",
    ),
  );
  return [...jsxTexts, ...attributeTexts];
}
