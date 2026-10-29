import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { Stopwatch } from "./Stopwatch";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

test("đếm đúng số giây khi chạy", () => {
  render(<Stopwatch />);
  fireEvent.click(screen.getByRole("button", { name: "Bắt đầu" }));
  act(() => vi.advanceTimersByTime(3000));
  expect(screen.getByText("3 giây")).toBeInTheDocument();
});

test("dừng rồi chạy tiếp không bị mất số đã đếm", () => {
  render(<Stopwatch />);
  fireEvent.click(screen.getByRole("button", { name: "Bắt đầu" }));
  act(() => vi.advanceTimersByTime(2000));
  fireEvent.click(screen.getByRole("button", { name: "Dừng" }));
  act(() => vi.advanceTimersByTime(5000));
  expect(screen.getByText("2 giây")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Bắt đầu" }));
  act(() => vi.advanceTimersByTime(2000));
  expect(screen.getByText("4 giây")).toBeInTheDocument();
});
