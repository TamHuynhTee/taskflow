import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { useDebouncedValue } from "./useDebouncedValue";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

test("chỉ cập nhật sau khi ngừng đổi đủ lâu", () => {
  const { result, rerender } = renderHook(({ v }) => useDebouncedValue(v, 300), {
    initialProps: { v: "a" },
  });
  rerender({ v: "ab" });
  act(() => vi.advanceTimersByTime(200));
  rerender({ v: "abc" });
  act(() => vi.advanceTimersByTime(200));
  expect(result.current).toBe("a");
  act(() => vi.advanceTimersByTime(100));
  expect(result.current).toBe("abc");
});
