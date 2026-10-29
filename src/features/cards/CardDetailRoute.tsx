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

/** Route con /boards/:boardId/cards/:cardId — modal đè lên board (T3.1). */
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

  // ".." theo cây route (cards/:cardId → boards/:boardId), giữ nguyên bộ lọc trên URL.
  const close = () => navigate({ pathname: "..", search });

  async function handleDelete() {
    if (!card) return;
    const ok = await confirmRef.current?.open(`Xoá "${card.title}"?`, {
      danger: true,
      confirmText: "Xoá",
    });
    if (!ok) return;
    try {
      await actions.remove(card);
      toast.show("success", `Đã xoá "${card.title}"`);
      close();
    } catch (error) {
      toast.show("error", `Xoá thất bại: ${errorText(error)}`);
    }
  }

  return (
    <Modal open title={card?.title ?? "Không tìm thấy card"} onClose={close} size="lg">
      {card ? (
        <CardDetail
          card={card}
          board={board}
          assignee={card.assigneeId ? usersById[card.assigneeId] : undefined}
          today={TODAY}
          actions={
            <Button variant="danger" size="sm" onClick={handleDelete}>
              Xoá card
            </Button>
          }
        >
          {/* key: đổi card → state promise của CommentsSection reset theo card mới. */}
          <CommentsSection key={card.id} cardId={card.id} />
        </CardDetail>
      ) : (
        <NotFoundView action={<Link to={{ pathname: "..", search }}>Đóng</Link>} />
      )}
      <ConfirmDialog ref={confirmRef} />
    </Modal>
  );
}
