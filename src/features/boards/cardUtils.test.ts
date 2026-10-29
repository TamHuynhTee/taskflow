import { expect, test } from "vitest";
import { makeCard } from "../../test/factories";
import { nextColumnId, nextOrder, nextPriority } from "./cardUtils";

test("nextColumnId moves both ways and stays put at the edges", () => {
  expect(nextColumnId("todo", "right")).toBe("doing");
  expect(nextColumnId("doing", "right")).toBe("done");
  expect(nextColumnId("done", "right")).toBe("done");
  expect(nextColumnId("done", "left")).toBe("doing");
  expect(nextColumnId("todo", "left")).toBe("todo");
});

test("nextOrder = highest order in the board's column + 1", () => {
  const cards = [
    makeCard({ id: "1", order: 4 }),
    makeCard({ id: "2", order: 9, columnId: "done" }),
    makeCard({ id: "3", order: 20, boardId: "b2" }),
  ];
  expect(nextOrder(cards, "b1", "todo")).toBe(5);
  expect(nextOrder(cards, "b1", "doing")).toBe(0);
});

test("nextPriority stops at urgent", () => {
  expect(nextPriority("low")).toBe("medium");
  expect(nextPriority("high")).toBe("urgent");
  expect(nextPriority("urgent")).toBe("urgent");
});
