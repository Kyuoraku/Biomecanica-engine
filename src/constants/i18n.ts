export const SUPPORTED_LANGUAGES = ["es", "en"] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const FALLBACK_LANGUAGE: SupportedLanguage = "es";

export const LANGUAGE_STORAGE_KEY = "biomecanica.language";

export const LANGUAGE_DETECTION_ORDER = ["localStorage", "navigator"];
