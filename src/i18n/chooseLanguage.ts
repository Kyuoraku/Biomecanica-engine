import type { i18n } from "i18next";
import { LANGUAGE_STORAGE_KEY, type SupportedLanguage } from "../constants/i18n";

export async function chooseLanguage(
  translator: i18n,
  language: SupportedLanguage,
  storage: Pick<Storage, "setItem"> | undefined,
): Promise<void> {
  await translator.changeLanguage(language);
  try {
    storage?.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    return;
  }
}
