import type { ReactNode } from "react";
import { Avatar, Badge } from "../../components/ui";
import type { Board, Card, User } from "../../types";
import { formatDueDate, getDueStatus } from "../../utils/date";
import { labelMeta, priorityMeta } from "./cardMeta";
import "./CardItem.css";
import "./cardViews.css";

interface CardDetailProps {
  card: Card;
  board?: Board;
  assignee: User | undefined;
  today: string;
  /** Nút thao tác (Sửa, Xoá...) hiện dưới mô tả. */
  actions?: ReactNode;
  /** Phần bình luận: <CommentList /> + form gửi bình luận (T4.2, T4.5). */
  children?: ReactNode;
}

/** Nội dung chi tiết 1 card — đặt bên trong <Modal> (T3.1, T3.4). */
export function CardDetail({
  card,
  board,
  assignee,
  today,
  actions,
  children,
}: CardDetailProps) {
  const column = board?.columns.find((c) => c.id === card.columnId);
  const dueStatus =
    card.columnId === "done" ? "normal" : getDueStatus(card.dueDate, today);

  return (
    <div className="card-detail">
      <div className="card-detail__labels">
        {card.labels.map((l) => (
          <Badge key={l} tone={labelMeta[l].tone}>
            {labelMeta[l].text}
          </Badge>
        ))}
      </div>

      <dl className="card-detail__meta">
        <div>
          <dt>Cột</dt>
          <dd>{column?.title ?? card.columnId}</dd>
        </div>
        <div>
          <dt>Độ ưu tiên</dt>
          <dd>
            <Badge tone={priorityMeta[card.priority].tone}>
              {priorityMeta[card.priority].text}
            </Badge>
          </dd>
        </div>
        <div>
          <dt>Hạn chót</dt>
          <dd className={`card-item__due--${dueStatus}`}>
            {card.dueDate ? formatDueDate(card.dueDate) : "—"}
          </dd>
        </div>
        <div>
          <dt>Giao cho</dt>
          <dd className="card-detail__assignee">
            {assignee ? (
              <>
                <Avatar user={assignee} size={20} /> {assignee.name}
              </>
            ) : (
              "Chưa giao"
            )}
          </dd>
        </div>
      </dl>

      <section>
        <h3 className="card-detail__heading">Mô tả</h3>
        <p className="card-detail__desc">
          {card.description || <em>Chưa có mô tả.</em>}
        </p>
      </section>

      {actions && <div className="card-detail__actions">{actions}</div>}

      {children && (
        <section>
          <h3 className="card-detail__heading">Bình luận</h3>
          {children}
        </section>
      )}
    </div>
  );
}
