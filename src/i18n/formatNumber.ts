import type { SupportedLanguage } from "../constants/i18n";

export function formatNumber(
  value: number,
  language: SupportedLanguage,
  fractionDigits: number,
): string {
  return new Intl.NumberFormat(language, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value);
}
