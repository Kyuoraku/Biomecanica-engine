import { test } from "vitest";
import { clamp } from "./clamp";

test("calls clamp", () => {
  clamp(5, 0, 10);
});
