import { useState, type DragEvent, type ReactNode } from "react";
import { Badge } from "../../components/Badge";
import type { Card, ColumnId, Column as ColumnType, User } from "../../types";
import { CardItem, type CardItemProps } from "../cards/CardItem";
import "./Column.css";

/** CardItem props that outside code may attach to each card. */
export type CardExtraProps = Partial<
  Omit<CardItemProps, "card" | "assignee" | "today">
>;

interface ColumnProps {
  column: ColumnType;
  cards: Card[];
  usersById: Record<string, User>;
  today: string;
  /** Attach callbacks/flags to each card, e.g. card => ({ onDelete: () => ..., isPending: ... }). */
  getCardProps?: (card: Card) => CardExtraProps;
  /** When given, cards are draggable: dropping a card on this column calls it with the card id and target column id (T4.5). */
  onDropCard?: (cardId: string, toColumnId: ColumnId) => void;
  /** Content at the bottom of the column, e.g. a "+ Add card" button. */
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
  // Pure UI state: the column a card is being dragged over, to highlight its border.
  const [isDropTarget, setIsDropTarget] = useState(false);

  // Create a new array with toReversed() — DON'T call cards.reverse(), because it mutates
  // the very props array the parent component is holding.
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
          title="Reverse order"
        >
          ⇅
        </button>
      </header>

      {visibleCards.length === 0 ? (
        <p className="column__empty">Empty</p>
      ) : (
        <div className="column__list">
          {visibleCards.map((card) => {
            const extra = getCardProps?.(card);
            return (
              // key EXPERIMENT (T0.2): pass showNote to CardItem, change to key={index},
              // type a note into the first card, then press ⇅. The note "sticks" to the first position
              // instead of following the card: React matches elements by key, same key = same component
              // = keeps its state/DOM (the input). With key={card.id}, the state follows the right card.
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
