export const TRACKED_FEATURE_STATES = ["en_progreso", "en_review", "hecho"] as const;

export const TRACED_TEST_FOLDERS = ["tests/criteria", "tests/evidence"] as const;

export const REQUIRED_CASES = ["feliz", "triste"] as const;

export const FEATURE_LIST_FILE = "docs/feature_list.json";

export const TEST_TAG_PATTERN = /\[([A-Z]-\d{2})\.(\d+)\]\[([a-z]+)\]/g;
