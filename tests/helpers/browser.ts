import { vi } from "vitest";

export function stubBrowserLanguages(languages: string[]): void {
  vi.spyOn(window.navigator, "languages", "get").mockReturnValue(languages);
  vi.spyOn(window.navigator, "language", "get").mockReturnValue(languages[0] ?? "");
}
