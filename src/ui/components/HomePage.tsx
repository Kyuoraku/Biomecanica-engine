import { useTranslation } from "react-i18next";

export function HomePage() {
  const { t } = useTranslation();
  return (
    <main className="home">
      <h1 className="home__title">{t("home.title")}</h1>
      <p className="home__subtitle">{t("home.subtitle")}</p>
    </main>
  );
}
