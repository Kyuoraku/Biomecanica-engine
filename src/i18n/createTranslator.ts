import i18next, { type i18n } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import {
  FALLBACK_LANGUAGE,
  LANGUAGE_DETECTION_ORDER,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from "../constants/i18n";
import en from "../locales/en.json";
import es from "../locales/es.json";
import { isSupportedLanguage } from "./isSupportedLanguage";

export class MissingTranslationError extends Error {
  constructor(key: string) {
    super(`Missing translation key: ${key}`);
    this.name = "MissingTranslationError";
  }
}

export type TranslatorOptions = {
  language?: SupportedLanguage;
  document?: Document;
};

export function activeLanguage(translator: i18n): SupportedLanguage {
  const language = translator.resolvedLanguage;
  return isSupportedLanguage(language) ? language : FALLBACK_LANGUAGE;
}

export function createTranslator({ language, document }: TranslatorOptions = {}): i18n {
  const instance = i18next.createInstance();
  const syncDocumentLanguage = () => {
    if (document) {
      document.documentElement.lang = activeLanguage(instance);
    }
  };
  instance.on("languageChanged", syncDocumentLanguage);
  instance
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      lng: language,
      supportedLngs: [...SUPPORTED_LANGUAGES],
      nonExplicitSupportedLngs: true,
      load: "languageOnly",
      fallbackLng: FALLBACK_LANGUAGE,
      resources: { es: { translation: es }, en: { translation: en } },
      detection: {
        order: LANGUAGE_DETECTION_ORDER,
        caches: [],
        lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      },
      initAsync: false,
      interpolation: { escapeValue: false },
      saveMissing: import.meta.env.DEV,
      missingKeyHandler: (_languages, _namespace, key) => {
        throw new MissingTranslationError(key);
      },
    });
  syncDocumentLanguage();
  return instance;
}
