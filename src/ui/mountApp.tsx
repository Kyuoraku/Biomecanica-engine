import { StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { ROOT_ELEMENT_ID } from "../constants/app";
import { createTranslator } from "../i18n/createTranslator";
import { App } from "./App";

export class MissingRootElementError extends Error {
  constructor(id: string) {
    super(`Root element #${id} not found`);
    this.name = "MissingRootElementError";
  }
}

export function mountApp(document: Document, rootId: string = ROOT_ELEMENT_ID): Root {
  const element = document.getElementById(rootId);
  if (!element) {
    throw new MissingRootElementError(rootId);
  }
  const root = createRoot(element);
  root.render(
    <StrictMode>
      <App translator={createTranslator()} />
    </StrictMode>,
  );
  return root;
}
