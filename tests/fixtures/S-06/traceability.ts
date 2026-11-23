import type { Feature, TestTag } from "../../helpers/traceability";

export const featureInReview: Feature = {
  id: "Z-01",
  estado: "en_review",
  criterios_aceptacion: ["Primer criterio", "Segundo criterio"],
};

export const pendingFeature: Feature = {
  id: "Z-02",
  estado: "pendiente",
  criterios_aceptacion: ["Criterio sin tests todavía"],
};

export const completeTags: TestTag[] = [
  { criterion: "Z-01.1", testCase: "feliz" },
  { criterion: "Z-01.1", testCase: "triste" },
  { criterion: "Z-01.2", testCase: "feliz" },
  { criterion: "Z-01.2", testCase: "triste" },
];

export const tagsWithoutSadCase: TestTag[] = completeTags.filter(
  (tag) => !(tag.criterion === "Z-01.2" && tag.testCase === "triste"),
);

export const tagsWithUnknownCriterion: TestTag[] = [
  ...completeTags,
  { criterion: "X-99.1", testCase: "feliz" },
];

export const sourceWithTaggedTests = `
it("[Z-01.1][feliz] primero", () => {});
it("[Z-01.1][triste] primero", () => {});
test("[Z-01.2][evidencia] captura", async () => {});
`;

export const strykerOutputBelowThreshold = `
----------|------------------|----------|-----------|------------|----------|----------|
File      | % Mutation score | # killed | # timeout | # survived | # no cov | # errors |
----------|------------------|----------|-----------|------------|----------|----------|
All files |  79.99 |   79.99 |        8 |         0 |          2 |        0 |        0 |
`;
