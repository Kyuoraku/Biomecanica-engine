export const EVIDENCE_SERVER_PORT = 4173;

export const EVIDENCE_BASE_URL = `http://localhost:${EVIDENCE_SERVER_PORT}`;

export const SCREENSHOTS_FOLDER = "screenshots";

export const DESKTOP_VIEWPORT = { width: 1400, height: 1000 } as const;

export const PHONE_VIEWPORT = { width: 390, height: 844 } as const;

export const VIEWPORTS_BY_PROJECT = {
  desktop: DESKTOP_VIEWPORT,
  phone: PHONE_VIEWPORT,
} as const;

export const SOFTWARE_WEBGL_ARGS = ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"];

export const SOFTWARE_RENDERER_PATTERN = /swiftshader/i;

export const GPU_RENDERER_EXAMPLE = "ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11)";
