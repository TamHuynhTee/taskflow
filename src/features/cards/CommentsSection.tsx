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
 * Bình luận đọc bằng use(promise) + Suspense (T4.2), gửi optimistic (T4.5).
 *
 * THÍ NGHIỆM: đổi `promise` thành `getComments(cardId)` (không cache) truyền thẳng vào
 * <Comments> → mỗi render là một promise MỚI → use() lại suspend → resolve → render lại →
 * promise mới... Tab Network thấy request lặp vô hạn. Promise phải được tạo bên ngoài
 * render (cache, state, loader của router, hoặc Server Component — T7.5).
 */
export function CommentsSection({ cardId }: { cardId: string }) {
  const [promise, setPromise] = useState(() => getCommentsPromise(cardId));

  function refresh() {
    invalidateComments(cardId);
    const next = getCommentsPromise(cardId);
    // Trong transition: giữ danh sách cũ trên màn hình thay vì nháy skeleton.
    startTransition(() => setPromise(next));
    return next;
  }

  return (
    <ErrorBoundary
      resetKeys={[promise]}
      fallback={(error) => (
        <ErrorMessage
          compact
          title="Không tải được bình luận"
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
      // Chờ danh sách mới về rồi mới kết thúc action, để comment thật thay chỗ comment
      // optimistic mà không có khoảnh khắc biến mất.
      await onAdded();
    } catch (error) {
      // Action kết thúc → optimistic tự bị bỏ (rollback), chỉ cần báo lỗi.
      toast.show("error", `Không gửi được bình luận: ${errorText(error)}`);
    }
  }

  // use() được gọi trong if — điều mà hook thường (useContext, useState...) không được phép.
  const usersById =
    optimistic.length > 0 ? use(BoardStateContext)?.usersById ?? {} : {};

  return (
    <>
      <CommentList comments={optimistic} usersById={usersById} />
      <form action={submit}>
        <CommentComposerFields
          submit={<SubmitButton pendingText="Đang gửi…">Gửi</SubmitButton>}
        />
      </form>
    </>
  );
}
