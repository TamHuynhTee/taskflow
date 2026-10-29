import type { Card } from "../types";

export function makeCard(overrides: Partial<Card> = {}): Card {
  return {
    id: "c1",
    boardId: "b1",
    columnId: "todo",
    title: "Card",
    description: "",
    labels: [],
    priority: "medium",
    dueDate: null,
    assigneeId: null,
    order: 0,
    createdAt: "2026-10-01T00:00:00.000Z",
    ...overrides,
  };
}
