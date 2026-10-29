import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { BoardCards } from "./BoardCards";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

test("mỗi boardId chỉ gọi load đúng 1 lần", async () => {
  const load = vi.fn(async ({ boardId }: { boardId: string }) => [
    `card của ${boardId}`,
  ]);
  const { rerender } = render(<BoardCards boardId="b1" load={load} />);
  await screen.findByText("card của b1");
  await wait(50);
  expect(load).toHaveBeenCalledTimes(1);

  rerender(<BoardCards boardId="b2" load={load} />);
  await screen.findByText("card của b2");
  await wait(50);
  expect(load).toHaveBeenCalledTimes(2);
  expect(load).toHaveBeenLastCalledWith({ boardId: "b2", includeArchived: false });
});
