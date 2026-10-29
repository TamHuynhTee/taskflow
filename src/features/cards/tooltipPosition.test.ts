import { expect, test } from "vitest";
import { computeTooltipPosition } from "./tooltipPosition";

const viewport = { width: 1000, height: 800 };
const size = { width: 200, height: 100 };

test("defaults to below, left-aligned", () => {
  expect(computeTooltipPosition({ top: 100, bottom: 150, left: 50 }, size, viewport)).toEqual({ top: 158, left: 50 });
});

test("overflows the bottom → flips above", () => {
  expect(computeTooltipPosition({ top: 700, bottom: 750, left: 50 }, size, viewport).top).toBe(592);
});

test("overflows the right → shifts left, never closer than 8px to the edge", () => {
  expect(computeTooltipPosition({ top: 100, bottom: 150, left: 900 }, size, viewport).left).toBe(792);
  expect(computeTooltipPosition({ top: 0, bottom: 10, left: 0 }, size, { width: 100, height: 50 })).toEqual({ top: 8, left: 8 });
});
