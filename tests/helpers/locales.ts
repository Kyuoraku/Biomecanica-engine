import { readFileSync } from "node:fs";
import { listFiles } from "./architecture";

export type LocaleTree = { [key: string]: string | LocaleTree };

export type UsedKeys = {
  exact: string[];
  prefixes: string[];
};

const literalKeyPattern = /\bt\(\s*["']([^"']+)["']/g;

const templateKeyPattern = /\bt\(\s*`([^`$]*)\$\{[^`]*`/g;

export function flattenKeys(tree: LocaleTree, prefix = ""): string[] {
  return Object.entries(tree).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "string" ? [path] : flattenKeys(value, path);
  });
}

export function findKeyDifferences(first: LocaleTree, second: LocaleTree): string[] {
  const firstKeys = new Set(flattenKeys(first));
  const secondKeys = new Set(flattenKeys(second));
  return [
    ...[...firstKeys].filter((key) => !secondKeys.has(key)),
    ...[...secondKeys].filter((key) => !firstKeys.has(key)),
  ].sort();
}

export function extractUsedKeys(source: string): UsedKeys {
  return {
    exact: [...source.matchAll(literalKeyPattern)].map((match) => match[1] ?? ""),
    prefixes: [...source.matchAll(templateKeyPattern)].map((match) => match[1] ?? ""),
  };
}

export function collectUsedKeys(folder: string, extensions: readonly string[]): UsedKeys {
  return listFiles(folder, extensions)
    .map((path) => extractUsedKeys(readFileSync(path, "utf-8")))
    .reduce(
      (all, used) => ({
        exact: [...all.exact, ...used.exact],
        prefixes: [...all.prefixes, ...used.prefixes],
      }),
      { exact: [], prefixes: [] },
    );
}

export function findMissingKeys(used: UsedKeys, tree: LocaleTree): string[] {
  const available = flattenKeys(tree);
  const missingExact = used.exact.filter((key) => !available.includes(key));
  const missingPrefixes = used.prefixes.filter(
    (prefix) => !available.some((key) => key.startsWith(prefix)),
  );
  return [...missingExact, ...missingPrefixes];
}

export function findUnusedKeys(used: UsedKeys, tree: LocaleTree): string[] {
  return flattenKeys(tree).filter(
    (key) => !used.exact.includes(key) && !used.prefixes.some((prefix) => key.startsWith(prefix)),
  );
}
