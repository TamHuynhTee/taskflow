import type { Card, ColumnId } from "../../types";

export function nextColumnId(
  columnId: ColumnId,
  direction: "left" | "right",
): ColumnId {
  if (direction === "left") {
    switch (columnId) {
      case "done":
        return "doing";
      case "doing":
        return "todo";
    }
  }
  if (direction === "right") {
    switch (columnId) {
      case "todo":
        return "doing";
      case "doing":
        return "done";
    }
  }
  return columnId;
}

export function nextOrder(
  cards: Card[],
  boardId: string,
  columnId: ColumnId,
): number {
  return 0;
}
