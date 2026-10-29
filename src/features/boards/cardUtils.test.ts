import { expect, test } from "vitest";
import { makeCard } from "../../test/factories";
import { nextColumnId, nextOrder, nextPriority } from "./cardUtils";

test("nextColumnId đi qua lại và giữ nguyên ở biên", () => {
  expect(nextColumnId("todo", "right")).toBe("doing");
  expect(nextColumnId("doing", "right")).toBe("done");
  expect(nextColumnId("done", "right")).toBe("done");
  expect(nextColumnId("done", "left")).toBe("doing");
  expect(nextColumnId("todo", "left")).toBe("todo");
});

test("nextOrder = order lớn nhất trong cột của board + 1", () => {
  const cards = [
    makeCard({ id: "1", order: 4 }),
    makeCard({ id: "2", order: 9, columnId: "done" }),
    makeCard({ id: "3", order: 20, boardId: "b2" }),
  ];
  expect(nextOrder(cards, "b1", "todo")).toBe(5);
  expect(nextOrder(cards, "b1", "doing")).toBe(0);
});

test("nextPriority dừng ở urgent", () => {
  expect(nextPriority("low")).toBe("medium");
  expect(nextPriority("high")).toBe("urgent");
  expect(nextPriority("urgent")).toBe("urgent");
});
