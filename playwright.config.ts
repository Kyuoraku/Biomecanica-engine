import { defineConfig } from "@playwright/test";
import {
  DESKTOP_VIEWPORT,
  EVIDENCE_BASE_URL,
  EVIDENCE_SERVER_PORT,
  PHONE_VIEWPORT,
  SOFTWARE_WEBGL_ARGS,
} from "./tests/constants/evidence";

export default defineConfig({
  testDir: "tests/evidence",
  use: {
    baseURL: EVIDENCE_BASE_URL,
    launchOptions: { args: SOFTWARE_WEBGL_ARGS },
  },
  projects: [
    { name: "desktop", use: { viewport: DESKTOP_VIEWPORT } },
    { name: "phone", use: { viewport: PHONE_VIEWPORT, isMobile: true, hasTouch: true } },
  ],
  webServer: {
    command: `pnpm build && pnpm preview --port ${EVIDENCE_SERVER_PORT} --strictPort`,
    url: EVIDENCE_BASE_URL,
    reuseExistingServer: !process.env.CI,
  },
});
