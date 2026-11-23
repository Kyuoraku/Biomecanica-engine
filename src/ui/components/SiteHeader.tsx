import { useTranslation } from "react-i18next";
import { LanguageSelector } from "./LanguageSelector";

export function SiteHeader() {
  const { t } = useTranslation();
  return (
    <header className="site-header">
      <div className="site-header__text">
        <h1 className="site-header__title">{t("home.title")}</h1>
        <p className="site-header__subtitle">{t("home.subtitle")}</p>
      </div>
      <LanguageSelector />
    </header>
  );
}
