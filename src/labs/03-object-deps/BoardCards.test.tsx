import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { BoardCards } from "./BoardCards";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

test("each boardId calls load exactly once", async () => {
  const load = vi.fn(async ({ boardId }: { boardId: string }) => [
    `cards of ${boardId}`,
  ]);
  const { rerender } = render(<BoardCards boardId="b1" load={load} />);
  await screen.findByText("cards of b1");
  await wait(50);
  expect(load).toHaveBeenCalledTimes(1);

  rerender(<BoardCards boardId="b2" load={load} />);
  await screen.findByText("cards of b2");
  await wait(50);
  expect(load).toHaveBeenCalledTimes(2);
  expect(load).toHaveBeenLastCalledWith({ boardId: "b2", includeArchived: false });
});
