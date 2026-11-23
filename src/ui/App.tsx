import type { i18n } from "i18next";
import { I18nextProvider } from "react-i18next";
import { HomePage } from "./components/HomePage";

type AppProps = {
  translator: i18n;
};

export function App({ translator }: AppProps) {
  return (
    <I18nextProvider i18n={translator}>
      <HomePage />
    </I18nextProvider>
  );
}
