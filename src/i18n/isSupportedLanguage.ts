import { SUPPORTED_LANGUAGES, type SupportedLanguage } from "../constants/i18n";

export function isSupportedLanguage(value: string | undefined): value is SupportedLanguage {
  return SUPPORTED_LANGUAGES.some((language) => language === value);
}
