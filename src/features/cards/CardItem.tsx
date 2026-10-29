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

  // ---- Tương tác: tất cả tuỳ chọn. Không truyền thì nút tương ứng bị ẩn. ----
  /** Click tiêu đề → mở chi tiết card (T3.1). */
  onOpen?: () => void;
  /** Nút 🗑 (T1.1). */
  onDelete?: () => void;
  /** Nút ← → chuyển cột (T1.1). Nút tự disable ở cột đầu/cuối. */
  onMove?: (direction: "left" | "right") => void;
  /** Nút ⏫ tăng độ ưu tiên (T1.4). */
  onBumpPriority?: () => void;
  /** Double-click tiêu đề → bắt đầu sửa (T1.1). */
  onTitleDoubleClick?: () => void;
  /** Khi đang sửa tiêu đề, truyền <InlineEdit /> vào đây để thay chỗ tiêu đề (T1.1). */
  titleEditor?: ReactNode;
  /** Đang chờ server (optimistic, T4.5) → card mờ đi. */
  isPending?: boolean;
  /** Hiện ô ghi chú — chỉ dùng cho thí nghiệm `key` ở T0.2. */
  showNote?: boolean;
  /** Props gắn thẳng vào thẻ <article>: onMouseEnter/onMouseLeave (tooltip T2.5), tabIndex/onKeyDown (T6.3), ... */
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
  // Card đã xong thì không cảnh báo quá hạn nữa.
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
                  label="Chuyển sang cột trái"
                  disabled={card.columnId === "todo"}
                  onClick={() => onMove("left")}
                >
                  ←
                </IconButton>
                <IconButton
                  label="Chuyển sang cột phải"
                  disabled={card.columnId === "done"}
                  onClick={() => onMove("right")}
                >
                  →
                </IconButton>
              </>
            )}
            {onBumpPriority && (
              <IconButton
                label="Tăng độ ưu tiên"
                disabled={card.priority === "urgent"}
                onClick={onBumpPriority}
              >
                ⏫
              </IconButton>
            )}
            {onDelete && (
              <IconButton label="Xoá card" variant="danger" onClick={onDelete}>
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

      {/* && : chỉ render khi vế trái truthy. An toàn ở đây vì description là string
          ('' là falsy và React không render chuỗi rỗng). Cẩn thận với số: {0 && ...} sẽ in ra "0". */}
      {card.description && (
        <p className="card-item__desc">{card.description}</p>
      )}

      <footer className="card-item__footer">
        <Badge tone={priority.tone} title="Độ ưu tiên">
          {priority.text}
        </Badge>

        {card.dueDate !== null && (
          <span
            className={`card-item__due card-item__due--${dueStatus}`}
            title={card.dueDate}
          >
            {dueStatus === "overdue" ? "⚠ Quá hạn " : "📅 "}
            {formatDueDate(card.dueDate)}
          </span>
        )}

        <span className="card-item__assignee">
          {assignee ? (
            <Avatar user={assignee} />
          ) : (
            <span className="card-item__unassigned">Chưa giao</span>
          )}
        </span>
      </footer>

      {showNote && (
        <input
          className="card-item__note"
          placeholder="Ghi chú nhanh…"
          aria-label={`Ghi chú cho ${card.title}`}
        />
      )}
    </article>
  );
}
