import type { Card, ColumnId, Priority } from "../../types";

const COLUMN_ORDER: ColumnId[] = ["todo", "doing", "done"];
const PRIORITY_ORDER: Priority[] = ["low", "medium", "high", "urgent"];

/** todo ⇄ doing ⇄ done; stays put at the edges (T1.1). */
export function nextColumnId(
  columnId: ColumnId,
  direction: "left" | "right",
): ColumnId {
  const i = COLUMN_ORDER.indexOf(columnId);
  const next = direction === "left" ? i - 1 : i + 1;
  return COLUMN_ORDER[next] ?? columnId;
}

/** Highest `order` in the column + 1; empty column → 0 (T1.1). */
export function nextOrder(
  cards: Card[],
  boardId: string,
  columnId: ColumnId,
): number {
  let max = -1;
  for (const c of cards) {
    if (c.boardId === boardId && c.columnId === columnId && c.order > max) {
      max = c.order;
    }
  }
  return max + 1;
}

/** low → medium → high → urgent; urgent stays put (T1.4). */
export function nextPriority(p: Priority): Priority {
  return PRIORITY_ORDER[PRIORITY_ORDER.indexOf(p) + 1] ?? p;
}
