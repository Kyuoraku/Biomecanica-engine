import type { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "../../constants/i18n";
import { chooseLanguage } from "../../i18n/chooseLanguage";
import { activeLanguage } from "../../i18n/createTranslator";
import { isSupportedLanguage } from "../../i18n/isSupportedLanguage";

function readStorage(): Storage | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
}

export function LanguageSelector() {
  const { t, i18n } = useTranslation();
  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (isSupportedLanguage(event.target.value)) {
      chooseLanguage(i18n, event.target.value, readStorage());
    }
  };
  return (
    <label className="language-selector">
      <span className="language-selector__label">{t("language.label")}</span>
      <select
        className="language-selector__select"
        value={activeLanguage(i18n)}
        onChange={handleChange}
      >
        {SUPPORTED_LANGUAGES.map((language) => (
          <option key={language} value={language}>
            {t(`language.names.${language}`)}
          </option>
        ))}
      </select>
    </label>
  );
}
