import { useRef } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { TODAY } from "../../app/today";
import {
  ConfirmDialog,
  type ConfirmDialogHandle,
} from "../../components/ConfirmDialog";
import { Button, Modal } from "../../components/ui";
import { useBoardState, useCardActions } from "../../context/BoardContext";
import { useToast } from "../../context/ToastContext";
import { NotFoundView } from "../../pages/NotFoundView";
import { errorText } from "../../utils/error";
import { CardDetail } from "./CardDetail";
import { CommentsSection } from "./CommentsSection";

/** Child route /boards/:boardId/cards/:cardId — a modal over the board (T3.1). */
export function CardDetailRoute() {
  const { boardId, cardId } = useParams();
  const { boards, cards, usersById } = useBoardState();
  const actions = useCardActions();
  const toast = useToast();
  const navigate = useNavigate();
  const { search } = useLocation();
  const confirmRef = useRef<ConfirmDialogHandle>(null);

  const board = boards.find((b) => b.id === boardId);
  const card = cards.find((c) => c.id === cardId && c.boardId === boardId);

  // ".." follows the route tree (cards/:cardId → boards/:boardId), keeping the filters in the URL.
  const close = () => navigate({ pathname: "..", search });

  async function handleDelete() {
    if (!card) return;
    const ok = await confirmRef.current?.open(`Delete "${card.title}"?`, {
      danger: true,
      confirmText: "Delete",
    });
    if (!ok) return;
    try {
      await actions.remove(card);
      toast.show("success", `Deleted "${card.title}"`);
      close();
    } catch (error) {
      toast.show("error", `Delete failed: ${errorText(error)}`);
    }
  }

  return (
    <Modal open title={card?.title ?? "Card not found"} onClose={close} size="lg">
      {card ? (
        <CardDetail
          card={card}
          board={board}
          assignee={card.assigneeId ? usersById[card.assigneeId] : undefined}
          today={TODAY}
          actions={
            <Button variant="danger" size="sm" onClick={handleDelete}>
              Delete card
            </Button>
          }
        >
          {/* key: switching cards → CommentsSection's promise state resets for the new card. */}
          <CommentsSection key={card.id} cardId={card.id} />
        </CardDetail>
      ) : (
        <NotFoundView action={<Link to={{ pathname: "..", search }}>Close</Link>} />
      )}
      <ConfirmDialog ref={confirmRef} />
    </Modal>
  );
}
