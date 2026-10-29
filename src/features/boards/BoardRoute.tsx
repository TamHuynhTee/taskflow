import { Suspense, useState, useTransition } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import {
  BoardSkeleton,
  EmptyState,
  ErrorMessage,
  Tabs,
} from "../../components/ui";
import { useBoardState } from "../../context/BoardContext";
import { NotFoundView } from "../../pages/NotFoundView";
import { BoardPage } from "./BoardPage";

/** /boards → chuyển tới board đầu tiên. */
export function BoardsIndex() {
  const { boards } = useBoardState();
  if (boards.length === 0) {
    return <EmptyState title="Chưa có board nào" />;
  }
  return <Navigate to={`/boards/${boards[0].id}`} replace />;
}

/**
 * /boards/:boardId — Tabs + Suspense quanh BoardPage (T4.6).
 *
 * Đổi board bằng Tabs: navigate nằm trong startTransition → React render board mới "ở hậu
 * trường"; khi BoardPage mới suspend (đang tải card) React GIỮ board cũ trên màn hình thay vì
 * thay bằng skeleton, và isPending cho ta làm mờ board cũ + hiện chấm loading trên tab.
 *
 * Lưu ý (đã kiểm chứng): React Router v8 TỰ bọc mọi navigation trong startTransition, nên bấm
 * sidebar cũng không nháy skeleton — nhưng board cũ đứng im không có dấu hiệu gì, vì isPending
 * của router không đến được đây. useTransition của chính mình mới cho biết "đang chuyển".
 * Thí nghiệm: thay navigate(...) bằng navigate(`/boards/${id}`, { flushSync: true }) (cập nhật
 * đồng bộ, không transition) để thấy skeleton nháy.
 */
export function BoardRoute() {
  const { boardId } = useParams();
  const { boards } = useBoardState();
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const [targetId, setTargetId] = useState<string | null>(null);

  const board = boards.find((b) => b.id === boardId);
  if (!board) {
    return <NotFoundView action={<Link to="/boards">Về trang board</Link>} />;
  }

  return (
    <>
      <Tabs
        items={boards.map((b) => ({ id: b.id, label: b.title }))}
        activeId={board.id}
        pendingId={isPending ? targetId : null}
        onSelect={(id) => {
          setTargetId(id);
          startTransition(() => navigate(`/boards/${id}`));
        }}
      />
      {/* resetKeys thay vì key: key mới sẽ tạo Suspense boundary mới → luôn hiện fallback,
          phá mất hiệu ứng giữ board cũ của transition. */}
      <ErrorBoundary
        resetKeys={[board.id]}
        fallback={(error, reset) => (
          <ErrorMessage
            title="Không tải được board"
            error={error}
            onRetry={reset}
          />
        )}
      >
        <Suspense fallback={<BoardSkeleton />}>
          <BoardPage key={board.id} board={board} isStale={isPending} />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
