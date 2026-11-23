import i18next, { type i18n } from "i18next";
import { initReactI18next } from "react-i18next";
import { FALLBACK_LANGUAGE, type SupportedLanguage } from "../constants/i18n";
import en from "../locales/en.json";
import es from "../locales/es.json";

export class MissingTranslationError extends Error {
  constructor(key: string) {
    super(`Missing translation key: ${key}`);
    this.name = "MissingTranslationError";
  }
}

export function createTranslator(language: SupportedLanguage = FALLBACK_LANGUAGE): i18n {
  const instance = i18next.createInstance();
  instance.use(initReactI18next).init({
    lng: language,
    fallbackLng: FALLBACK_LANGUAGE,
    resources: { es: { translation: es }, en: { translation: en } },
    initAsync: false,
    interpolation: { escapeValue: false },
    saveMissing: true,
    missingKeyHandler: (_languages, _namespace, key) => {
      throw new MissingTranslationError(key);
    },
  });
  return instance;
}
