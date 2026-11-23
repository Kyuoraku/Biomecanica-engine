import { expect, test } from "vitest";
import { clamp } from "./clamp";

test("keeps values inside the range", () => {
  expect(clamp(5, 0, 10)).toBe(5);
});

test("raises values below the minimum", () => {
  expect(clamp(-1, 0, 10)).toBe(0);
});

test("lowers values above the maximum", () => {
  expect(clamp(11, 0, 10)).toBe(10);
});

test("keeps the limits themselves", () => {
  expect(clamp(0, 0, 10)).toBe(0);
  expect(clamp(10, 0, 10)).toBe(10);
});
