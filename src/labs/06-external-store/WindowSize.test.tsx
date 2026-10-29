import { act, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { WindowSize } from "./WindowSize";

function resizeTo(width: number, height: number) {
  Object.assign(window, { innerWidth: width, innerHeight: height });
  window.dispatchEvent(new Event("resize"));
}

test("hiện kích thước cửa sổ và cập nhật khi resize", () => {
  resizeTo(1024, 768);
  render(<WindowSize />);
  expect(screen.getByText("1024 × 768")).toBeInTheDocument();
  act(() => resizeTo(500, 700));
  expect(screen.getByText("500 × 700")).toBeInTheDocument();
});
