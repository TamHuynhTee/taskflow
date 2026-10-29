import { startTransition, Suspense, use, useOptimistic, useState } from "react";
import { addComment } from "../../api/comments";
import {
  getCommentsPromise,
  invalidateComments,
} from "../../api/commentsCache";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { SubmitButton } from "../../components/SubmitButton";
import { ErrorMessage } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import { BoardStateContext } from "../../context/BoardContext";
import { useToast } from "../../context/ToastContext";
import type { Comment, CommentView } from "../../types";
import { errorText } from "../../utils/error";
import {
  CommentComposerFields,
  CommentList,
  CommentListSkeleton,
} from "./CommentList";

/**
 * Comments are read with use(promise) + Suspense (T4.2) and sent optimistically (T4.5).
 *
 * EXPERIMENT: change `promise` to `getComments(cardId)` (no cache) passed straight into
 * <Comments> → every render gets a NEW promise → use() suspends again → resolves → re-renders →
 * new promise... The Network tab shows requests looping forever. The promise must be created outside
 * render (a cache, state, a router loader, or a Server Component — T7.5).
 */
export function CommentsSection({ cardId }: { cardId: string }) {
  const [promise, setPromise] = useState(() => getCommentsPromise(cardId));

  function refresh() {
    invalidateComments(cardId);
    const next = getCommentsPromise(cardId);
    // Inside a transition: keep the old list on screen instead of flashing the skeleton.
    startTransition(() => setPromise(next));
    return next;
  }

  return (
    <ErrorBoundary
      resetKeys={[promise]}
      fallback={(error) => (
        <ErrorMessage
          compact
          title="Couldn't load comments"
          error={error}
          onRetry={refresh}
        />
      )}
    >
      <Suspense fallback={<CommentListSkeleton />}>
        <Comments promise={promise} cardId={cardId} onAdded={refresh} />
      </Suspense>
    </ErrorBoundary>
  );
}

function Comments({
  promise,
  cardId,
  onAdded,
}: {
  promise: Promise<Comment[]>;
  cardId: string;
  onAdded: () => Promise<Comment[]>;
}) {
  const comments = use(promise);
  const { user } = useAuth();
  const toast = useToast();
  const [optimistic, addOptimistic] = useOptimistic(
    comments,
    (state: CommentView[], c: CommentView) => [...state, { ...c, pending: true }],
  );

  async function submit(formData: FormData) {
    const content = String(formData.get("content") ?? "").trim();
    if (!content || !user) return;
    const input = {
      cardId,
      authorId: user.id,
      content,
      createdAt: new Date().toISOString(),
    };
    addOptimistic({ ...input, id: `pending-${crypto.randomUUID()}` });
    try {
      await addComment(input);
      // Wait for the new list before ending the action, so the real comment replaces the
      // optimistic one without a moment where it disappears.
      await onAdded();
    } catch (error) {
      // The action ends → the optimistic state is dropped automatically (rollback); just report the error.
      toast.show("error", `Couldn't send the comment: ${errorText(error)}`);
    }
  }

  // use() is called inside an if — something regular hooks (useContext, useState...) aren't allowed to do.
  const usersById =
    optimistic.length > 0 ? use(BoardStateContext)?.usersById ?? {} : {};

  return (
    <>
      <CommentList comments={optimistic} usersById={usersById} />
      <form action={submit}>
        <CommentComposerFields
          submit={<SubmitButton pendingText="Sending…">Send</SubmitButton>}
        />
      </form>
    </>
  );
}
