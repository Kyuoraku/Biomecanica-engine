export const componentWithHardcodedText = `
export function Greeting() {
  return (
    <section>
      <h1>Hola mundo</h1>
      <img alt="Esqueleto" src="a.png" />
    </section>
  );
}
`;

export const componentWithTranslatedText = `
export function Greeting() {
  const { t } = useTranslation();
  return (
    <section>
      <h1>{t("home.title")}</h1>
      <img alt={t("home.subtitle")} src="a.png" />
    </section>
  );
}
`;

export const biomechanicsSourceWithLayerImports = `
import { Rig } from "../scene/rig/Rig";
import { Panel } from "../../ui/components/Panel";
import * as THREE from "three";
import { useState } from "react";
export { helper } from "../ui/helper";
const lazy = import("../scene/lazy");
import { solve } from "./solvers/squat";
`;

export const biomechanicsSourceWithPureImports = `
import { solve } from "./solvers/squat";
import { SEGMENT_FRACTIONS } from "../constants/anthropometry";
import type { Pose } from "./model/pose";
`;
