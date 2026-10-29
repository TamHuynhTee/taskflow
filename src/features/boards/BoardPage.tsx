import {
  Profiler,
  startTransition,
  use,
  useEffect,
  useEffectEvent,
  useLayoutEffect,
  useOptimistic,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { getCardsPromise } from "../../api/cardsCache";
import { TODAY } from "../../app/today";
import {
  ConfirmDialog,
  type ConfirmDialogHandle,
} from "../../components/ConfirmDialog";
import { Button, Modal, RenderCounter } from "../../components/ui";
import {
  useBoardDispatch,
  useBoardState,
  useCardActions,
} from "../../context/BoardContext";
import { useToast } from "../../context/ToastContext";
import { useFilterParams } from "../../hooks/useFilterParams";
import { useKeyboardShortcut } from "../../hooks/useKeyboardShortcut";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import type { Board, Card, ColumnId } from "../../types";
import { errorText } from "../../utils/error";
import { CardTooltip } from "../cards/CardTooltip";
import { CreateCardForm } from "../cards/CreateCardForm";
import { InlineEdit } from "../cards/InlineEdit";
import { onRender } from "../stats/profilerStore";
import { AddCardButton } from "./AddCardButton";
import { BoardSearch } from "./BoardSearch";
import { BoardView } from "./BoardView";
import { nextColumnId, nextOrder, nextPriority } from "./cardUtils";
import { FilterPanel } from "./FilterPanel";
import { filterCards } from "./filterCards";

interface BoardPageProps {
  board: Board;
  /** Switching boards in a transition (T4.6). */
  isStale?: boolean;
}

type Move = { id: string; toColumnId: ColumnId };

export function BoardPage({ board, isStale = false }: BoardPageProps) {
  // T2.3c: count renders with a ref. It can't be state: setState during render → re-render →
  // setState... an infinite loop. Changing a ref doesn't cause a render. In StrictMode (dev) React calls
  // the component twice per render to catch impure code → the count goes up by 2.
  // (Reading/writing ref.current during render breaks the "Rules of React"; only for observing/debugging.)
  const renderCount = useRef(0);
  renderCount.current++;

  // T4.6: load cards with use() + a cached promise. useState holds on to this mount's promise:
  // useCardActions clears the cache after every write, so reading getCardsPromise() directly every render
  // would create a new promise after each write → suspend → skeleton flash.
  const [cardsPromise] = useState(() => getCardsPromise(board.id));
  const fetched = use(cardsPromise);

  const { cards, users } = useBoardState();
  const dispatch = useBoardDispatch();
  const actions = useCardActions();
  const toast = useToast();
  const navigate = useNavigate();
  const { search } = useLocation();
  const [{ filter, query }, setParams] = useFilterParams();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hovered, setHovered] = useState<{ text: string; rect: DOMRect } | null>(
    null,
  );
  const [announcement, setAnnouncement] = useState("");
  const confirmRef = useRef<ConfirmDialogHandle>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const focusAfterRender = useRef<string | null>(null);

  // Put the freshly loaded data into the shared reducer. Until the reducer has it (first render),
  // show `fetched` directly so no frame is empty/stale and the T2.7 log counts correctly.
  const [synced, setSynced] = useState(false);
  useLayoutEffect(() => {
    dispatch({ type: "loaded", boardId: board.id, cards: fetched });
    setSynced(true);
  }, [dispatch, board.id, fetched]);

  const boardCards = synced
    ? cards.filter((c) => c.boardId === board.id)
    : fetched;

  // T4.5: the card moves column in the UI immediately; once the server answers, the real `cards` take over.
  // Error → the action ends with `cards` unchanged → the optimistic state "snaps back" on its own.
  const [optimisticCards, applyMove] = useOptimistic(
    boardCards,
    (state: Card[], m: Move) =>
      state.map((c) =>
        c.id === m.id
          ? {
              ...c,
              columnId: m.toColumnId,
              order: nextOrder(state, c.boardId, m.toColumnId),
            }
          : c,
      ),
  );
  const pendingIds = new Set(
    optimisticCards
      .filter((c) => boardCards.find((b) => b.id === c.id)?.columnId !== c.columnId)
      .map((c) => c.id),
  );

  // Filter directly during render (T1.3, T2.2) — no `filteredCards` state.
  const visibleCards = filterCards(optimisticCards, filter, query);

  // T2.7: log when a board opens (board.id changes), reading the latest visibleCount, but changing filters
  // does NOT re-run the effect. Dev StrictMode runs effects twice (mount → cleanup → mount)
  // so you see 2 logs; production only 1.
  const logOpen = useEffectEvent((boardId: string) => {
    console.info("[analytics] open board", boardId, {
      visibleCount: visibleCards.length,
    });
  });
  useEffect(() => logOpen(board.id), [board.id]);

  // T6.3: after moving column, the card renders in a different Column (a new component) → focus is lost.
  // Restore focus after every commit if a card is waiting for focus.
  useLayoutEffect(() => {
    const id = focusAfterRender.current;
    if (!id) return;
    const el = document.getElementById(`card-${id}`);
    if (el && el !== document.activeElement) el.focus();
  });

  useKeyboardShortcut("/", (e) => {
    e.preventDefault();
    searchRef.current?.focus();
  });
  useKeyboardShortcut("n", () => setIsCreateOpen(true), {
    enabled: !isCreateOpen,
  });

  const columnTitle = (id: ColumnId) =>
    board.columns.find((c) => c.id === id)?.title ?? id;

  function moveCard(cardId: string, toColumnId: ColumnId) {
    const card = boardCards.find((c) => c.id === cardId);
    if (!card || card.columnId === toColumnId) return;
    focusAfterRender.current = cardId;
    startTransition(async () => {
      applyMove({ id: cardId, toColumnId });
      try {
        await actions.move(card, toColumnId);
        setAnnouncement(`Moved "${card.title}" to ${columnTitle(toColumnId)}`);
      } catch (error) {
        toast.show("error", `Couldn't move "${card.title}": ${errorText(error)}`);
      }
    });
  }

  async function deleteCard(card: Card) {
    const ok = await confirmRef.current?.open(`Delete "${card.title}"?`, {
      danger: true,
      confirmText: "Delete",
    });
    if (!ok) return;
    try {
      await actions.remove(card);
      setAnnouncement(`Deleted "${card.title}"`);
    } catch (error) {
      toast.show("error", `Delete failed: ${errorText(error)}`);
    }
  }

  async function renameCard(card: Card, title: string) {
    setEditingCardId(null);
    if (!title || title === card.title) return;
    try {
      await actions.update(card, { title });
    } catch (error) {
      toast.show("error", `Rename failed: ${errorText(error)}`);
    }
  }

  async function bumpPriority(card: Card) {
    // T1.4: the ⏫ button raises priority by 2 levels. The buggy useState-era version called
    //   setCards(cards.map(c => ({ ...c, priority: nextPriority(c.priority) })))
    // → both calls read the same `cards` snapshot from this render, so the result is only +1 level,
    // and console.log(cards) right after setCards still prints the old value (state only changes on the next render).
    // The fix uses the updater `setCards(prev => ...)` so the 2nd call gets the 1st call's result.
    // Here the target is computed once and sent as 1 PATCH request.
    const priority = nextPriority(nextPriority(card.priority));
    try {
      await actions.update(card, { priority });
    } catch (error) {
      toast.show("error", `Couldn't change priority: ${errorText(error)}`);
    }
  }

  const openCard = (card: Card) =>
    navigate({ pathname: `cards/${card.id}`, search });

  function handleCardKeyDown(e: KeyboardEvent<HTMLElement>, card: Card) {
    if (e.target !== e.currentTarget) return; // ignore keys typed into a child button/field
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      moveCard(card.id, nextColumnId(card.columnId, e.key === "ArrowLeft" ? "left" : "right"));
    } else if (e.key === "Enter") {
      openCard(card);
    } else if (e.key === "Delete") {
      deleteCard(card);
    }
  }

  const filterPanel = (
    <FilterPanel
      value={filter}
      onChange={(next) => setParams({ filter: next })}
      users={users}
    />
  );

  return (
    <>
      {/* T4.9: React 19 hoists <title>/<meta> into <head> automatically. */}
      <title>{`${board.title} · TaskFlow`}</title>
      <meta name="description" content={board.description} />

      <Profiler id="BoardView" onRender={onRender}>
        <BoardView
          board={board}
          cards={visibleCards}
          users={users}
          today={TODAY}
          isStale={isStale}
          toolbar={
            <>
              <BoardSearch ref={searchRef} />
              {isMobile && (
                <Button size="sm" onClick={() => setIsFilterOpen(true)}>
                  Filters
                </Button>
              )}
              <Button variant="primary" onClick={() => setIsCreateOpen(true)}>
                + New card
              </Button>
              <RenderCounter count={renderCount.current} />
            </>
          }
          onDropCard={moveCard}
          renderColumnFooter={(column) =>
            column.id === "todo" && (
              <AddCardButton onClick={() => setIsCreateOpen(true)} />
            )
          }
          getCardProps={(card) => {
            // T3.7 experiment: this runs while Column renders → an error here is caught by the
            // column's ErrorBoundary. Create a card with 💣 in its title to see only that column fail.
            if (card.title.includes("💣")) throw new Error("Bomb card!");
            return {
              isPending: pendingIds.has(card.id),
              onOpen: () => openCard(card),
              onDelete: () => deleteCard(card),
              onMove: (dir) => moveCard(card.id, nextColumnId(card.columnId, dir)),
              onBumpPriority: () => bumpPriority(card),
              onTitleDoubleClick: () => setEditingCardId(card.id),
              titleEditor:
                editingCardId === card.id ? (
                  <InlineEdit
                    defaultValue={card.title}
                    onCommit={(title) => renameCard(card, title)}
                    onCancel={() => setEditingCardId(null)}
                  />
                ) : undefined,
              articleProps: {
                id: `card-${card.id}`,
                tabIndex: 0,
                "aria-label": card.title,
                onKeyDown: (e) => handleCardKeyDown(e, card),
                onFocus: () => {
                  focusAfterRender.current = null;
                },
                onMouseEnter: (e) => {
                  if (!card.description) return;
                  setHovered({
                    text: card.description,
                    rect: e.currentTarget.getBoundingClientRect(),
                  });
                },
                onMouseLeave: () => setHovered(null),
              },
            };
          }}
        />
      </Profiler>

      {hovered && <CardTooltip anchor={hovered.rect} text={hovered.text} />}

      <Modal
        open={isCreateOpen}
        title="New card"
        onClose={() => setIsCreateOpen(false)}
      >
        <CreateCardForm
          boardId={board.id}
          today={TODAY}
          onCreated={(card) => {
            setIsCreateOpen(false);
            setAnnouncement(`Created "${card.title}"`);
          }}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Modal>

      <Modal
        open={isFilterOpen}
        title="Filters"
        size="sm"
        onClose={() => setIsFilterOpen(false)}
      >
        {filterPanel}
      </Modal>

      <ConfirmDialog ref={confirmRef} />
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      {/* Child route: card detail modal (T3.1). */}
      <Outlet />
    </>
  );
}
