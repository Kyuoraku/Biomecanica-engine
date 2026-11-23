export const SOURCE_ROOT = "src";

export const BIOMECHANICS_FOLDER = "src/biomechanics";

export const REQUIRED_SOURCE_FOLDERS = [
  "src/biomechanics",
  "src/scene",
  "src/ui",
  "src/exercises",
  "src/muscles",
  "src/i18n",
  "src/constants",
  "src/locales",
] as const;

export const FORBIDDEN_BIOMECHANICS_IMPORTS = [
  /(^|\/)scene(\/|$)/,
  /(^|\/)ui(\/|$)/,
  /^three(\/|$)/,
  /^react(-dom)?(\/|$)/,
] as const;

export const CODE_FILE_EXTENSIONS = [".ts", ".tsx"] as const;

export const COMPONENT_FILE_EXTENSION = ".tsx";

export const USER_FACING_ATTRIBUTES = ["title", "alt", "aria-label", "placeholder"] as const;
