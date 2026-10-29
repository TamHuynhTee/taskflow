import type { BoardStats, Card } from "../../types";
import { getDueStatus } from "../../utils/date";

/** Số liệu thống kê (T5.3). Một vòng lặp O(n) — bọc useMemo ở nơi gọi. */
export function computeBoardStats(cards: Card[], today: string): BoardStats {
  const stats: BoardStats = {
    total: cards.length,
    overdue: 0,
    unassigned: 0,
    byColumn: { todo: 0, doing: 0, done: 0 },
    byPriority: { low: 0, medium: 0, high: 0, urgent: 0 },
  };
  for (const c of cards) {
    stats.byColumn[c.columnId]++;
    stats.byPriority[c.priority]++;
    if (!c.assigneeId) stats.unassigned++;
    if (c.columnId !== "done" && getDueStatus(c.dueDate, today) === "overdue") {
      stats.overdue++;
    }
  }
  return stats;
}
