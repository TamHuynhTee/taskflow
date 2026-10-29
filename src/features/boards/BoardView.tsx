import type { ReactNode } from "react";
import type {
  Board,
  Card,
  ColumnId,
  Column as ColumnType,
  User,
} from "../../types";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { ErrorMessage } from "../../components/ui";
import { Column, type CardExtraProps } from "./Column";
import "./BoardView.css";

interface BoardViewProps {
  board: Board;
  /** Cards to display. You can pass every card — BoardView filters by board.id itself. */
  cards: Card[];
  users: User[];
  today: string;
  /** Toolbar to the right of the title: search box, new card button, RenderCounter... */
  toolbar?: ReactNode;
  /** Passed down to each Column — see Column.tsx. */
  getCardProps?: (card: Card) => CardExtraProps;
  onDropCard?: (cardId: string, toColumnId: ColumnId) => void;
  renderColumnFooter?: (column: ColumnType) => ReactNode;
  /** Dims the columns when the data shown is stale (T4.6 isPending, T4.7 deferred). */
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
  // Derived data: computed directly from props during render, no need to store it in state.
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
          // T3.7: one boundary per column → one broken card only breaks its own column.
          <ErrorBoundary
            key={column.id}
            fallback={(error, reset) => (
              <section className="column" aria-label={column.title}>
                <ErrorMessage
                  compact
                  title={`Column "${column.title}" crashed`}
                  error={error}
                  onRetry={reset}
                />
              </section>
            )}
          >
          <Column
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
          </ErrorBoundary>
        ))}
      </div>
    </div>
  );
}
