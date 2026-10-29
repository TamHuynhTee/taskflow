import {
  createContext,
  use,
  useMemo,
  useReducer,
  type ActionDispatch,
  type ReactNode,
} from "react";
import { getBoards, getUsers } from "../api/boards";
import * as cardsApi from "../api/cards";
import { invalidateCards } from "../api/cardsCache";
import { ErrorMessage, PageSkeleton } from "../components/ui";
import {
  boardReducer,
  type BoardAction,
} from "../features/boards/boardReducer";
import { nextOrder } from "../features/boards/cardUtils";
import { useFetch } from "../hooks/useFetch";
import type { Board, Card, ColumnId, User } from "../types";

export interface BoardState {
  boards: Board[];
  users: User[];
  usersById: Record<string, User>;
  cards: Card[];
}

/**
 * Tách 2 context (T3.3): component chỉ cần dispatch (nút, form) không render lại
 * mỗi khi danh sách card thay đổi, vì giá trị `dispatch` của useReducer không bao giờ đổi.
 */
export const BoardStateContext = createContext<BoardState | null>(null);
const BoardDispatchContext = createContext<ActionDispatch<
  [BoardAction]
> | null>(null);

export function BoardProvider({ children }: { children: ReactNode }) {
  const [cards, dispatch] = useReducer(boardReducer, []);
  const meta = useFetch(
    async (signal) => {
      const [boards, users] = await Promise.all([
        getBoards(signal),
        getUsers(signal),
      ]);
      return { boards, users };
    },
    [],
  );

  const state = useMemo<BoardState | null>(() => {
    if (!meta.data) return null;
    const { boards, users } = meta.data;
    return {
      boards,
      users,
      usersById: Object.fromEntries(users.map((u) => [u.id, u])),
      cards,
    };
  }, [meta.data, cards]);

  if (meta.error) {
    return (
      <ErrorMessage
        title="Không tải được dữ liệu"
        error={meta.error}
        onRetry={meta.reload}
      />
    );
  }
  if (!state) return <PageSkeleton />;

  return (
    <BoardStateContext value={state}>
      <BoardDispatchContext value={dispatch}>{children}</BoardDispatchContext>
    </BoardStateContext>
  );
}

export function useBoardState() {
  const ctx = use(BoardStateContext);
  if (!ctx) throw new Error("useBoardState phải dùng bên trong <BoardProvider>");
  return ctx;
}

export function useBoardDispatch() {
  const ctx = use(BoardDispatchContext);
  if (!ctx) {
    throw new Error("useBoardDispatch phải dùng bên trong <BoardProvider>");
  }
  return ctx;
}

/**
 * Gói "gọi API rồi dispatch" (pessimistic, T2.1). Mỗi lần ghi thành công thì xoá cache
 * promise của board để lần mở board sau tải lại dữ liệu mới (T4.6).
 */
export function useCardActions() {
  const { cards } = useBoardState();
  const dispatch = useBoardDispatch();

  return {
    async create(input: Omit<Card, "id">) {
      const card = await cardsApi.createCard({
        ...input,
        order: nextOrder(cards, input.boardId, input.columnId),
      });
      dispatch({ type: "added", card });
      invalidateCards(card.boardId);
      return card;
    },
    async update(card: Card, patch: Partial<Card>) {
      const saved = await cardsApi.updateCard(card.id, patch);
      dispatch({ type: "replaced", card: saved });
      invalidateCards(card.boardId);
      return saved;
    },
    async move(card: Card, toColumnId: ColumnId) {
      const order = nextOrder(cards, card.boardId, toColumnId);
      const saved = await cardsApi.updateCard(card.id, {
        columnId: toColumnId,
        order,
      });
      dispatch({ type: "replaced", card: saved });
      invalidateCards(card.boardId);
      return saved;
    },
    async remove(card: Card) {
      await cardsApi.deleteCard(card.id);
      dispatch({ type: "deleted", id: card.id });
      invalidateCards(card.boardId);
    },
  };
}
