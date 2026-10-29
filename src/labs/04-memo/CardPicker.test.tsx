import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, expect, test } from "vitest";
import { CardPicker, renderLog } from "./CardPicker";

const cards = ["A", "B", "C"];
beforeEach(() => {
  renderLog.length = 0;
});

test("state không liên quan đổi → không dòng nào render lại", () => {
  render(<CardPicker cards={cards} />);
  renderLog.length = 0;
  fireEvent.click(screen.getByRole("button", { name: "Làm mới" }));
  expect(renderLog).toEqual([]);
});

test("chọn card → chỉ dòng đổi trạng thái render lại", () => {
  render(<CardPicker cards={cards} />);
  renderLog.length = 0;
  fireEvent.click(screen.getByRole("button", { name: "B" }));
  expect(renderLog).toEqual(["B"]);
  expect(screen.getByRole("button", { name: "B" })).toHaveAttribute("aria-pressed", "true");

  renderLog.length = 0;
  fireEvent.click(screen.getByRole("button", { name: "C" }));
  expect(renderLog.toSorted()).toEqual(["B", "C"]);
});
