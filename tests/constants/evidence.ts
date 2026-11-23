export const EVIDENCE_SERVER_PORT = 4173;

export const EVIDENCE_BASE_URL = `http://localhost:${EVIDENCE_SERVER_PORT}`;

export const SCREENSHOTS_FOLDER = "screenshots";

export const DESKTOP_VIEWPORT = { width: 1400, height: 1000 } as const;

export const PHONE_VIEWPORT = { width: 390, height: 844 } as const;

export const SOFTWARE_WEBGL_ARGS = ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"];
