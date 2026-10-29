import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { ContextLab, renderLog } from "./ContextLab";

test("Tick không làm consumer render lại", () => {
  render(<ContextLab />);
  renderLog.length = 0;
  fireEvent.click(screen.getByRole("button", { name: "Tick" }));
  expect(renderLog).toEqual([]);
});

test("Đổi theme chỉ render lại ThemeLabel", () => {
  render(<ContextLab />);
  renderLog.length = 0;
  fireEvent.click(screen.getByRole("button", { name: "Đổi theme" }));
  expect(screen.getByText("Theme: dark")).toBeInTheDocument();
  expect(renderLog).toEqual(["ThemeLabel"]);
});
