import { useState } from "react";
import type { Board, Card, User } from "../../types";
import "./BoardView.css";
import { BoardView } from "./BoardView";
import { InlineEdit } from "../cards/InlineEdit";

interface BoardPageProps {
  board: Board;
  initialCards: Card[];
  users: User[];
  today: string;
}

export function BoardPage({
  board,
  users,
  initialCards,
  today,
}: BoardPageProps) {
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  function deleteCard(id: string) {}

  function moveCard(id: string, direction: "left" | "right") {}

  function onTitleDoubleClick() {}

  return (
    <BoardView
      board={board}
      cards={cards}
      today={today}
      users={users}
      getCardProps={(card) => ({
        onDelete: () => deleteCard(card.id),
        onMove: (dir) => moveCard(card.id, dir),
        onTitleDoubleClick,
        titleEditor: function () {
          if (editingCardId === card.id) {
            return (
              <InlineEdit
                defaultValue={card.title}
                onCommit={() => {}}
                onCancel={() => {}}
              />
            );
          }

          return null;
        },
      })}
    />
  );
}
