import type { Card, ColumnId, Priority } from "../../types";

const COLUMN_ORDER: ColumnId[] = ["todo", "doing", "done"];
const PRIORITY_ORDER: Priority[] = ["low", "medium", "high", "urgent"];

/** todo ⇄ doing ⇄ done; ở biên thì giữ nguyên (T1.1). */
export function nextColumnId(
  columnId: ColumnId,
  direction: "left" | "right",
): ColumnId {
  const i = COLUMN_ORDER.indexOf(columnId);
  const next = direction === "left" ? i - 1 : i + 1;
  return COLUMN_ORDER[next] ?? columnId;
}

/** `order` lớn nhất trong cột + 1; cột rỗng → 0 (T1.1). */
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

/** low → medium → high → urgent; urgent giữ nguyên (T1.4). */
export function nextPriority(p: Priority): Priority {
  return PRIORITY_ORDER[PRIORITY_ORDER.indexOf(p) + 1] ?? p;
}
