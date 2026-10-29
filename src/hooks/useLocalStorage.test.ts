import { act, renderHook } from "@testing-library/react";
import { expect, test } from "vitest";
import { useLocalStorage } from "./useLocalStorage";

test("đọc giá trị đã lưu, JSON hỏng thì dùng initial", () => {
  localStorage.setItem("ok", JSON.stringify(5));
  localStorage.setItem("bad", "{oops");
  expect(renderHook(() => useLocalStorage("ok", 0)).result.current[0]).toBe(5);
  expect(renderHook(() => useLocalStorage("bad", 1)).result.current[0]).toBe(1);
});

test("setter nhận updater và ghi vào localStorage", () => {
  const { result } = renderHook(() => useLocalStorage("n", 1));
  act(() => result.current[1]((n) => n + 1));
  expect(result.current[0]).toBe(2);
  expect(localStorage.getItem("n")).toBe("2");
});
