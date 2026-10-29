import { expect, test } from "vitest";
import { makeCard } from "../../test/factories";
import { computeBoardStats } from "./computeStats";

test("computeBoardStats counts correctly; done cards aren't counted as overdue", () => {
  const stats = computeBoardStats(
    [
      makeCard({ id: "1", dueDate: "2026-10-01", assigneeId: "u1" }),
      makeCard({ id: "2", dueDate: "2026-10-01", columnId: "done", priority: "urgent" }),
      makeCard({ id: "3", columnId: "doing", priority: "low" }),
    ],
    "2026-10-29",
  );
  expect(stats).toEqual({
    total: 3,
    overdue: 1,
    unassigned: 2,
    byColumn: { todo: 1, doing: 1, done: 1 },
    byPriority: { low: 1, medium: 1, high: 0, urgent: 1 },
  });
});
