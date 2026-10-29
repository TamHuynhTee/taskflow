import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, expect, test } from "vitest";
import { CardPicker, renderLog } from "./CardPicker";

const cards = ["A", "B", "C"];
beforeEach(() => {
  renderLog.length = 0;
});

test("unrelated state changes → no row re-renders", () => {
  render(<CardPicker cards={cards} />);
  renderLog.length = 0;
  fireEvent.click(screen.getByRole("button", { name: "Refresh" }));
  expect(renderLog).toEqual([]);
});

test("selecting a card → only rows whose state changed re-render", () => {
  render(<CardPicker cards={cards} />);
  renderLog.length = 0;
  fireEvent.click(screen.getByRole("button", { name: "B" }));
  expect(renderLog).toEqual(["B"]);
  expect(screen.getByRole("button", { name: "B" })).toHaveAttribute("aria-pressed", "true");

  renderLog.length = 0;
  fireEvent.click(screen.getByRole("button", { name: "C" }));
  expect(renderLog.toSorted()).toEqual(["B", "C"]);
});
