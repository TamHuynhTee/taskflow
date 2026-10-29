import type { ComponentProps, ReactNode } from "react";
import { Avatar } from "../../components/Avatar";
import { Badge } from "../../components/Badge";
import { IconButton } from "../../components/ui";
import type { Card, User } from "../../types";
import { formatDueDate, getDueStatus } from "../../utils/date";
import { labelMeta, priorityMeta } from "./cardMeta";
import "./CardItem.css";

export interface CardItemProps {
  card: Card;
  assignee: User | undefined;
  today: string;

  // ---- Interactions: all optional. If not passed, the matching button is hidden. ----
  /** Clicking the title → opens the card detail (T3.1). */
  onOpen?: () => void;
  /** The 🗑 button (T1.1). */
  onDelete?: () => void;
  /** ← → buttons to move columns (T1.1). Disabled automatically in the first/last column. */
  onMove?: (direction: "left" | "right") => void;
  /** ⏫ button to raise priority (T1.4). */
  onBumpPriority?: () => void;
  /** Double-clicking the title → start editing (T1.1). */
  onTitleDoubleClick?: () => void;
  /** While editing the title, pass <InlineEdit /> here to replace the title (T1.1). */
  titleEditor?: ReactNode;
  /** Waiting on the server (optimistic, T4.5) → the card is dimmed. */
  isPending?: boolean;
  /** Shows a note field — only for the `key` experiment in T0.2. */
  showNote?: boolean;
  /** Props attached directly to the <article>: onMouseEnter/onMouseLeave (tooltip T2.5), tabIndex/onKeyDown (T6.3), ... */
  articleProps?: ComponentProps<"article">;
}

export function CardItem({
  card,
  assignee,
  today,
  onOpen,
  onDelete,
  onMove,
  onBumpPriority,
  onTitleDoubleClick,
  titleEditor,
  isPending = false,
  showNote = false,
  articleProps,
}: CardItemProps) {
  const priority = priorityMeta[card.priority];
  // Finished cards no longer get an overdue warning.
  const dueStatus =
    card.columnId === "done" ? "normal" : getDueStatus(card.dueDate, today);
  const hasActions = onMove || onBumpPriority || onDelete;

  return (
    <article
      {...articleProps}
      className={`card-item card-item--${card.priority} ${isPending ? "card-item--pending" : ""} ${articleProps?.className ?? ""}`}
      aria-busy={isPending || undefined}
    >
      <div className="card-item__top">
        <div className="card-item__labels">
          {card.labels.map((label) => (
            <Badge key={label} tone={labelMeta[label].tone}>
              {labelMeta[label].text}
            </Badge>
          ))}
        </div>

        {hasActions && (
          <div className="card-item__actions">
            {onMove && (
              <>
                <IconButton
                  label="Move to the left column"
                  disabled={card.columnId === "todo"}
                  onClick={() => onMove("left")}
                >
                  ←
                </IconButton>
                <IconButton
                  label="Move to the right column"
                  disabled={card.columnId === "done"}
                  onClick={() => onMove("right")}
                >
                  →
                </IconButton>
              </>
            )}
            {onBumpPriority && (
              <IconButton
                label="Raise priority"
                disabled={card.priority === "urgent"}
                onClick={onBumpPriority}
              >
                ⏫
              </IconButton>
            )}
            {onDelete && (
              <IconButton label="Delete card" variant="danger" onClick={onDelete}>
                🗑
              </IconButton>
            )}
          </div>
        )}
      </div>

      {titleEditor ?? (
        <h3 className="card-item__title" onDoubleClick={onTitleDoubleClick}>
          {onOpen ? (
            <button
              type="button"
              className="card-item__title-btn"
              onClick={onOpen}
            >
              {card.title}
            </button>
          ) : (
            card.title
          )}
        </h3>
      )}

      {/* && : only renders when the left side is truthy. Safe here because description is a string
          ('' is falsy and React doesn't render empty strings). Careful with numbers: {0 && ...} prints "0". */}
      {card.description && (
        <p className="card-item__desc">{card.description}</p>
      )}

      <footer className="card-item__footer">
        <Badge tone={priority.tone} title="Priority">
          {priority.text}
        </Badge>

        {card.dueDate !== null && (
          <span
            className={`card-item__due card-item__due--${dueStatus}`}
            title={card.dueDate}
          >
            {dueStatus === "overdue" ? "⚠ Overdue " : "📅 "}
            {formatDueDate(card.dueDate)}
          </span>
        )}

        <span className="card-item__assignee">
          {assignee ? (
            <Avatar user={assignee} />
          ) : (
            <span className="card-item__unassigned">Unassigned</span>
          )}
        </span>
      </footer>

      {showNote && (
        <input
          className="card-item__note"
          placeholder="Quick note…"
          aria-label={`Note for ${card.title}`}
        />
      )}
    </article>
  );
}
