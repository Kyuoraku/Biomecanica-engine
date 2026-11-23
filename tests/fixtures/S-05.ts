export const spanishWithExtraKey = {
  home: { title: "Título", subtitle: "Subtítulo" },
  language: { label: "Idioma" },
};

export const englishMissingKey = {
  home: { title: "Title" },
  language: { label: "Language" },
};

export const sourceUsingMissingKeys = `
const title = t("home.title");
const label = t("menu.open");
const name = t(\`exercises.names.\${id}\`);
`;
