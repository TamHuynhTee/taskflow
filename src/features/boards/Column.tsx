import { useState, type DragEvent, type ReactNode } from "react";
import { Badge } from "../../components/Badge";
import type { Card, ColumnId, Column as ColumnType, User } from "../../types";
import { CardItem, type CardItemProps } from "../cards/CardItem";
import "./Column.css";

/** Những props của CardItem mà bên ngoài được phép gắn thêm cho từng card. */
export type CardExtraProps = Partial<
  Omit<CardItemProps, "card" | "assignee" | "today">
>;

interface ColumnProps {
  column: ColumnType;
  cards: Card[];
  usersById: Record<string, User>;
  today: string;
  /** Gắn callback/cờ riêng cho từng card, vd. card => ({ onDelete: () => ..., isPending: ... }). */
  getCardProps?: (card: Card) => CardExtraProps;
  /** Có truyền thì card kéo thả được: thả card vào cột này sẽ gọi hàm với id card và id cột đích (T4.5). */
  onDropCard?: (cardId: string, toColumnId: ColumnId) => void;
  /** Nội dung cuối cột, vd. nút "+ Thêm card". */
  footer?: ReactNode;
}

const DRAG_TYPE = "text/x-taskflow-card";

export function Column({
  column,
  cards,
  usersById,
  today,
  getCardProps,
  onDropCard,
  footer,
}: ColumnProps) {
  const [reversed, setReversed] = useState(false);
  // State thuần UI: cột đang được kéo card bay qua để tô viền.
  const [isDropTarget, setIsDropTarget] = useState(false);

  // Tạo mảng mới bằng toReversed() — KHÔNG gọi cards.reverse() vì nó sửa (mutate)
  // chính mảng props mà component cha đang giữ.
  const visibleCards = reversed ? cards.toReversed() : cards;

  const dropHandlers = onDropCard && {
    onDragOver: (e: DragEvent) => {
      if (!e.dataTransfer.types.includes(DRAG_TYPE)) return;
      e.preventDefault();
      setIsDropTarget(true);
    },
    onDragLeave: (e: DragEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null))
        setIsDropTarget(false);
    },
    onDrop: (e: DragEvent) => {
      e.preventDefault();
      setIsDropTarget(false);
      const cardId = e.dataTransfer.getData(DRAG_TYPE);
      if (cardId) onDropCard(cardId, column.id);
    },
  };

  return (
    <section
      className={`column ${isDropTarget ? "column--drop-target" : ""}`}
      aria-label={column.title}
      {...dropHandlers}
    >
      <header className="column__header">
        <h2 className="column__title">{column.title}</h2>
        <Badge>{cards.length}</Badge>
        <button
          type="button"
          className="column__action"
          onClick={() => setReversed((r) => !r)}
          disabled={cards.length < 2}
          title="Đảo thứ tự"
        >
          ⇅
        </button>
      </header>

      {visibleCards.length === 0 ? (
        <p className="column__empty">Trống</p>
      ) : (
        <div className="column__list">
          {visibleCards.map((card) => {
            const extra = getCardProps?.(card);
            return (
              // THÍ NGHIỆM key (T0.2): truyền showNote vào CardItem, đổi thành key={index},
              // gõ ghi chú vào card đầu tiên rồi bấm ⇅. Ghi chú sẽ "dính" ở vị trí đầu
              // thay vì đi theo card: React ghép phần tử theo key, cùng key = cùng component
              // = giữ nguyên state/DOM (ô input). Với key={card.id}, state đi theo đúng card.
              <CardItem
                key={card.id}
                card={card}
                assignee={
                  card.assigneeId ? usersById[card.assigneeId] : undefined
                }
                today={today}
                {...extra}
                articleProps={{
                  ...(onDropCard && {
                    draggable: true,
                    onDragStart: (e: DragEvent) => {
                      e.dataTransfer.setData(DRAG_TYPE, card.id);
                      e.dataTransfer.effectAllowed = "move";
                    },
                  }),
                  ...extra?.articleProps,
                }}
              />
            );
          })}
        </div>
      )}

      <div className="column__footer">{footer}</div>
    </section>
  );
}
