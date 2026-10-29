import type { Card, ColumnId } from "../../types";
import { nextOrder, nextPriority } from "./cardUtils";

export type BoardAction =
  | { type: "loaded"; boardId: string; cards: Card[] }
  | { type: "added"; card: Card }
  | { type: "replaced"; card: Card }
  | { type: "deleted"; id: string }
  | { type: "renamed"; id: string; title: string }
  | { type: "moved"; id: string; toColumnId: ColumnId }
  | { type: "priorityBumped"; id: string };

/**
 * Pure reducer (T1.6): no Math.random, Date.now or API calls — ids/creation dates
 * are generated outside before dispatching. Always returns a new array, never mutates `cards`.
 */
export function boardReducer(cards: Card[], action: BoardAction): Card[] {
  switch (action.type) {
    case "loaded":
      return [
        ...cards.filter((c) => c.boardId !== action.boardId),
        ...action.cards,
      ];
    case "added":
      return [...cards, action.card];
    case "replaced":
      return cards.map((c) => (c.id === action.card.id ? action.card : c));
    case "deleted":
      return cards.filter((c) => c.id !== action.id);
    case "renamed":
      return cards.map((c) =>
        c.id === action.id ? { ...c, title: action.title } : c,
      );
    case "moved":
      return cards.map((c) =>
        c.id === action.id
          ? {
              ...c,
              columnId: action.toColumnId,
              order: nextOrder(cards, c.boardId, action.toColumnId),
            }
          : c,
      );
    case "priorityBumped":
      return cards.map((c) =>
        c.id === action.id ? { ...c, priority: nextPriority(c.priority) } : c,
      );
    default: {
      // Add a new action and forget to handle it → TypeScript errors here.
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}
