import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { Stopwatch } from "./Stopwatch";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

test("counts the right number of seconds while running", () => {
  render(<Stopwatch />);
  fireEvent.click(screen.getByRole("button", { name: "Start" }));
  act(() => vi.advanceTimersByTime(3000));
  expect(screen.getByText("3 seconds")).toBeInTheDocument();
});

test("stopping and starting again keeps the count", () => {
  render(<Stopwatch />);
  fireEvent.click(screen.getByRole("button", { name: "Start" }));
  act(() => vi.advanceTimersByTime(2000));
  fireEvent.click(screen.getByRole("button", { name: "Stop" }));
  act(() => vi.advanceTimersByTime(5000));
  expect(screen.getByText("2 seconds")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Start" }));
  act(() => vi.advanceTimersByTime(2000));
  expect(screen.getByText("4 seconds")).toBeInTheDocument();
});
