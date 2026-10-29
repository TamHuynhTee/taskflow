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

/** /boards → redirect to the first board. */
export function BoardsIndex() {
  const { boards } = useBoardState();
  if (boards.length === 0) {
    return <EmptyState title="No boards yet" />;
  }
  return <Navigate to={`/boards/${boards[0].id}`} replace />;
}

/**
 * /boards/:boardId — Tabs + Suspense around BoardPage (T4.6).
 *
 * Switching boards with Tabs: navigate runs inside startTransition → React renders the new board "in the
 * background"; when the new BoardPage suspends (loading cards) React KEEPS the old board on screen instead of
 * replacing it with the skeleton, and isPending lets us dim the old board + show a loading dot on the tab.
 *
 * Note (verified): React Router v8 wraps EVERY navigation in startTransition itself, so clicking the
 * sidebar doesn't flash the skeleton either — but the old board just sits there with no sign of anything, because
 * the router's isPending doesn't reach this component. Only our own useTransition tells us "switching".
 * Experiment: replace navigate(...) with navigate(`/boards/${id}`, { flushSync: true }) (a synchronous
 * update, no transition) to see the skeleton flash.
 */
export function BoardRoute() {
  const { boardId } = useParams();
  const { boards } = useBoardState();
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const [targetId, setTargetId] = useState<string | null>(null);

  const board = boards.find((b) => b.id === boardId);
  if (!board) {
    return <NotFoundView action={<Link to="/boards">Back to boards</Link>} />;
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
      {/* resetKeys instead of key: a new key would create a new Suspense boundary → always show the fallback,
          breaking the transition's keep-the-old-board behaviour. */}
      <ErrorBoundary
        resetKeys={[board.id]}
        fallback={(error, reset) => (
          <ErrorMessage
            title="Couldn't load the board"
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
