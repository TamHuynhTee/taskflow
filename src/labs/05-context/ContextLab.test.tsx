import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { ContextLab, renderLog } from "./ContextLab";

test("Tick doesn't re-render consumers", () => {
  render(<ContextLab />);
  renderLog.length = 0;
  fireEvent.click(screen.getByRole("button", { name: "Tick" }));
  expect(renderLog).toEqual([]);
});

test("Toggle theme only re-renders ThemeLabel", () => {
  render(<ContextLab />);
  renderLog.length = 0;
  fireEvent.click(screen.getByRole("button", { name: "Toggle theme" }));
  expect(screen.getByText("Theme: dark")).toBeInTheDocument();
  expect(renderLog).toEqual(["ThemeLabel"]);
});
