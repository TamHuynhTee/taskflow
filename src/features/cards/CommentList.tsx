import type { ReactNode } from "react";
import { Avatar, Skeleton } from "../../components/ui";
import type { CommentView, User } from "../../types";
import "./cardViews.css";

interface CommentListProps {
  comments: CommentView[];
  usersById: Record<string, User>;
}

/** Comment list. Comments with `pending: true` are dimmed with "Sending…" (T4.5). */
export function CommentList({ comments, usersById }: CommentListProps) {
  if (comments.length === 0) {
    return <p className="comment-list__empty">No comments yet.</p>;
  }

  return (
    <ul className="comment-list">
      {comments.map((c) => {
        const author = usersById[c.authorId];
        return (
          <li
            key={c.id}
            className={`comment ${c.pending ? "comment--pending" : ""}`}
          >
            {author && <Avatar user={author} size={28} />}
            <div className="comment__body">
              <p className="comment__meta">
                <strong>{author?.name ?? "Anonymous"}</strong>
                <span>
                  {c.pending
                    ? "Sending…"
                    : new Date(c.createdAt).toLocaleDateString("en-US")}
                </span>
              </p>
              <p className="comment__content">{c.content}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** Fallback while comments are loading (Suspense in T4.2). */
export function CommentListSkeleton() {
  return (
    <ul className="comment-list" aria-busy>
      {[0, 1].map((i) => (
        <li key={i} className="comment">
          <Skeleton width={28} height={28} radius={999} />
          <div className="comment__body">
            <Skeleton width={120} height={12} />
            <div style={{ marginTop: 6 }}>
              <Skeleton height={14} />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Comment form frame: you put the <form action=...> around it and pass the submit button as `submit`. */
export function CommentComposerFields({ submit }: { submit: ReactNode }) {
  return (
    <div className="comment-composer">
      <textarea
        name="content"
        rows={2}
        placeholder="Write a comment…"
        aria-label="Comment text"
        required
      />
      {submit}
    </div>
  );
}
