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
 * Two separate contexts (T3.3): components that only need dispatch (buttons, forms) don't re-render
 * whenever the card list changes, because useReducer's `dispatch` never changes.
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
        title="Couldn't load data"
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
  if (!ctx) throw new Error("useBoardState must be used inside <BoardProvider>");
  return ctx;
}

export function useBoardDispatch() {
  const ctx = use(BoardDispatchContext);
  if (!ctx) {
    throw new Error("useBoardDispatch must be used inside <BoardProvider>");
  }
  return ctx;
}

/**
 * Wraps "call the API, then dispatch" (pessimistic, T2.1). After every successful write it clears
 * the board's promise cache so the board loads fresh data the next time it opens (T4.6).
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
