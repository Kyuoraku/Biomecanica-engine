import type { Page } from "@playwright/test";

export async function readWebGlRenderer(page: Page): Promise<string> {
  return page.evaluate(() => {
    const context = document.createElement("canvas").getContext("webgl");
    if (!context) {
      return "";
    }
    const debugInfo = context.getExtension("WEBGL_debug_renderer_info");
    return String(
      context.getParameter(debugInfo ? debugInfo.UNMASKED_RENDERER_WEBGL : context.RENDERER),
    );
  });
}
