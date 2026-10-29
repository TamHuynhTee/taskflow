import type { ReactNode } from "react";
import type {
  Board,
  Card,
  ColumnId,
  Column as ColumnType,
  User,
} from "../../types";
import { Column, type CardExtraProps } from "./Column";
import "./BoardView.css";

interface BoardViewProps {
  board: Board;
  /** Card cần hiển thị. Có thể truyền tất cả card — BoardView tự lọc theo board.id. */
  cards: Card[];
  users: User[];
  today: string;
  /** Thanh công cụ góc phải tiêu đề: ô tìm kiếm, nút tạo card, RenderCounter... */
  toolbar?: ReactNode;
  /** Truyền xuống từng Column — xem Column.tsx. */
  getCardProps?: (card: Card) => CardExtraProps;
  onDropCard?: (cardId: string, toColumnId: ColumnId) => void;
  renderColumnFooter?: (column: ColumnType) => ReactNode;
  /** Làm mờ các cột khi dữ liệu đang hiển thị là dữ liệu cũ (T4.6 isPending, T4.7 deferred). */
  isStale?: boolean;
}

export function BoardView({
  board,
  cards,
  users,
  today,
  toolbar,
  getCardProps,
  onDropCard,
  renderColumnFooter,
  isStale = false,
}: BoardViewProps) {
  // Dữ liệu dẫn xuất: tính thẳng trong lúc render từ props, không cần lưu vào state.
  const usersById = Object.fromEntries(users.map((u) => [u.id, u]));
  const boardCards = cards.filter((c) => c.boardId === board.id);

  return (
    <div className={`board ${isStale ? "board--stale" : ""}`}>
      <header className="board__header">
        <div className="board__heading">
          <h2 className="board__title">{board.title}</h2>
          <p className="board__desc">{board.description}</p>
        </div>
        {toolbar && <div className="board__toolbar">{toolbar}</div>}
      </header>

      <div className="board__columns">
        {board.columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            cards={boardCards
              .filter((c) => c.columnId === column.id)
              .toSorted((a, b) => a.order - b.order)}
            usersById={usersById}
            today={today}
            getCardProps={getCardProps}
            onDropCard={onDropCard}
            footer={renderColumnFooter?.(column)}
          />
        ))}
      </div>
    </div>
  );
}
