import { describe, expect, test } from "vitest";
import { formatDueDate, getDueStatus } from "./date";

describe("getDueStatus", () => {
  const today = "2026-10-29";
  test.each([
    [null, "none"],
    ["2026-10-28", "overdue"],
    ["2026-10-29", "soon"],
    ["2026-10-31", "soon"],
    ["2026-11-01", "normal"],
    ["2026-10-30T23:59:00.000Z", "soon"],
  ] as const)("%s → %s", (due, expected) => {
    expect(getDueStatus(due, today)).toBe(expected);
  });
});

test("formatDueDate", () => {
  expect(formatDueDate("2026-10-28")).toBe("28/10");
});
