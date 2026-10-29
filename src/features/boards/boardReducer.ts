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
 * Reducer thuần (T1.6): không Math.random, Date.now hay gọi API — id/ngày tạo
 * được sinh bên ngoài trước khi dispatch. Luôn trả mảng mới, không mutate `cards`.
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
      // Thêm action mới mà quên xử lý → TypeScript báo lỗi ở đây.
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}
