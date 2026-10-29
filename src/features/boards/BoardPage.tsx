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
  /** Đang chuyển board bằng transition (T4.6). */
  isStale?: boolean;
}

type Move = { id: string; toColumnId: ColumnId };

export function BoardPage({ board, isStale = false }: BoardPageProps) {
  // T2.3c: đếm render bằng ref. Không thể là state: setState trong render → render lại →
  // setState... vòng lặp vô hạn. Ref đổi không gây render. Trong StrictMode (dev) React gọi
  // component 2 lần mỗi render để phát hiện code không thuần → số đếm tăng 2.
  // (Đọc/ghi ref.current trong render vi phạm "Rules of React"; chỉ dùng để quan sát/debug.)
  const renderCount = useRef(0);
  renderCount.current++;

  // T4.6: tải card bằng use() + promise có cache. useState giữ đúng promise của lần mount này:
  // useCardActions xoá cache sau mỗi lần ghi, nếu đọc thẳng getCardsPromise() mỗi render thì
  // mỗi lần ghi sẽ tạo promise mới → suspend → nháy skeleton.
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

  // Đưa dữ liệu vừa tải vào reducer chung. Trước khi reducer nhận xong (lần render đầu),
  // hiển thị thẳng `fetched` để không có khung hình nào trống/cũ và log T2.7 đếm đúng.
  const [synced, setSynced] = useState(false);
  useLayoutEffect(() => {
    dispatch({ type: "loaded", boardId: board.id, cards: fetched });
    setSynced(true);
  }, [dispatch, board.id, fetched]);

  const boardCards = synced
    ? cards.filter((c) => c.boardId === board.id)
    : fetched;

  // T4.5: card được chuyển cột ngay trên UI, server trả lời xong thì `cards` thật thay vào.
  // Lỗi → action kết thúc mà `cards` không đổi → optimistic tự "quay về".
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

  // Lọc thẳng lúc render (T1.3, T2.2) — không có state `filteredCards`.
  const visibleCards = filterCards(optimisticCards, filter, query);

  // T2.7: log khi mở board (board.id đổi), đọc visibleCount mới nhất nhưng đổi bộ lọc
  // KHÔNG làm effect chạy lại. Dev StrictMode chạy effect 2 lần (mount → cleanup → mount)
  // nên thấy 2 log; production chỉ 1.
  const logOpen = useEffectEvent((boardId: string) => {
    console.info("[analytics] open board", boardId, {
      visibleCount: visibleCards.length,
    });
  });
  useEffect(() => logOpen(board.id), [board.id]);

  // T6.3: sau khi chuyển cột, card render ở Column khác (component mới) → mất focus.
  // Đặt lại focus sau mỗi lần commit nếu đang có card cần focus.
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
        setAnnouncement(`Đã chuyển "${card.title}" sang ${columnTitle(toColumnId)}`);
      } catch (error) {
        toast.show("error", `Không chuyển được "${card.title}": ${errorText(error)}`);
      }
    });
  }

  async function deleteCard(card: Card) {
    const ok = await confirmRef.current?.open(`Xoá "${card.title}"?`, {
      danger: true,
      confirmText: "Xoá",
    });
    if (!ok) return;
    try {
      await actions.remove(card);
      setAnnouncement(`Đã xoá "${card.title}"`);
    } catch (error) {
      toast.show("error", `Xoá thất bại: ${errorText(error)}`);
    }
  }

  async function renameCard(card: Card, title: string) {
    setEditingCardId(null);
    if (!title || title === card.title) return;
    try {
      await actions.update(card, { title });
    } catch (error) {
      toast.show("error", `Đổi tên thất bại: ${errorText(error)}`);
    }
  }

  async function bumpPriority(card: Card) {
    // T1.4: nút ⏫ tăng 2 bậc. Bản sai thời useState: gọi 2 lần
    //   setCards(cards.map(c => ({ ...c, priority: nextPriority(c.priority) })))
    // → cả 2 lần đều đọc cùng snapshot `cards` của lần render này nên kết quả chỉ +1 bậc,
    // và console.log(cards) ngay sau setCards vẫn in giá trị cũ (state chỉ đổi ở lần render sau).
    // Bản đúng dùng updater `setCards(prev => ...)` để lần 2 nhận kết quả của lần 1.
    // Ở đây tính đích 1 lần rồi PATCH 1 request.
    const priority = nextPriority(nextPriority(card.priority));
    try {
      await actions.update(card, { priority });
    } catch (error) {
      toast.show("error", `Không đổi được độ ưu tiên: ${errorText(error)}`);
    }
  }

  const openCard = (card: Card) =>
    navigate({ pathname: `cards/${card.id}`, search });

  function handleCardKeyDown(e: KeyboardEvent<HTMLElement>, card: Card) {
    if (e.target !== e.currentTarget) return; // phím gõ trong nút/ô con thì bỏ qua
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
      {/* T4.9: React 19 tự đưa <title>/<meta> lên <head>. */}
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
                  Bộ lọc
                </Button>
              )}
              <Button variant="primary" onClick={() => setIsCreateOpen(true)}>
                + Tạo card
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
            // T3.7 thí nghiệm: hàm này chạy lúc Column render → lỗi ở đây được ErrorBoundary
            // của cột bắt. Tạo card tên chứa 💣 để thấy chỉ cột đó báo lỗi.
            if (card.title.includes("💣")) throw new Error("Card bom!");
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
        title="Tạo card mới"
        onClose={() => setIsCreateOpen(false)}
      >
        <CreateCardForm
          boardId={board.id}
          today={TODAY}
          onCreated={(card) => {
            setIsCreateOpen(false);
            setAnnouncement(`Đã tạo "${card.title}"`);
          }}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Modal>

      <Modal
        open={isFilterOpen}
        title="Bộ lọc"
        size="sm"
        onClose={() => setIsFilterOpen(false)}
      >
        {filterPanel}
      </Modal>

      <ConfirmDialog ref={confirmRef} />
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      {/* Route con: modal chi tiết card (T3.1). */}
      <Outlet />
    </>
  );
}
