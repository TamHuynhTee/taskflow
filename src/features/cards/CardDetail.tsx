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
  /** Action buttons (Edit, Delete...) shown below the description. */
  actions?: ReactNode;
  /** Comments section: <CommentList /> + the comment form (T4.2, T4.5). */
  children?: ReactNode;
}

/** Detail content for 1 card — goes inside a <Modal> (T3.1, T3.4). */
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
          <dt>Column</dt>
          <dd>{column?.title ?? card.columnId}</dd>
        </div>
        <div>
          <dt>Priority</dt>
          <dd>
            <Badge tone={priorityMeta[card.priority].tone}>
              {priorityMeta[card.priority].text}
            </Badge>
          </dd>
        </div>
        <div>
          <dt>Due date</dt>
          <dd className={`card-item__due--${dueStatus}`}>
            {card.dueDate ? formatDueDate(card.dueDate) : "—"}
          </dd>
        </div>
        <div>
          <dt>Assignee</dt>
          <dd className="card-detail__assignee">
            {assignee ? (
              <>
                <Avatar user={assignee} size={20} /> {assignee.name}
              </>
            ) : (
              "Unassigned"
            )}
          </dd>
        </div>
      </dl>

      <section>
        <h3 className="card-detail__heading">Description</h3>
        <p className="card-detail__desc">
          {card.description || <em>No description.</em>}
        </p>
      </section>

      {actions && <div className="card-detail__actions">{actions}</div>}

      {children && (
        <section>
          <h3 className="card-detail__heading">Comments</h3>
          {children}
        </section>
      )}
    </div>
  );
}
