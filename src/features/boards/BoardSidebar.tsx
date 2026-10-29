import type { ReactNode } from "react";
import type { Board } from "../../types";
import "./BoardSidebar.css";

interface BoardSidebarProps {
  boards: Board[];
  activeBoardId: string | null;
  /** Bấm vào board (T1.5). Ở T3.1 bạn đổi các nút này thành <NavLink to={`/boards/${id}`}>. */
  onSelectBoard?: (boardId: string) => void;
  /** Khu vực bộ lọc — truyền <FilterPanel /> vào (T1.3). */
  filters?: ReactNode;
}

export function BoardSidebar({
  boards,
  activeBoardId,
  onSelectBoard,
  filters,
}: BoardSidebarProps) {
  return (
    <nav className="board-sidebar">
      <section>
        <h2 className="board-sidebar__heading">Board</h2>
        <ul className="board-sidebar__list">
          {boards.map((board) => (
            <li key={board.id}>
              <button
                type="button"
                className="board-sidebar__item"
                aria-current={board.id === activeBoardId ? "page" : undefined}
                onClick={() => onSelectBoard?.(board.id)}
              >
                {board.title}
              </button>
            </li>
          ))}
        </ul>
      </section>

      {filters && (
        <section>
          <h2 className="board-sidebar__heading">Bộ lọc</h2>
          {filters}
        </section>
      )}
    </nav>
  );
}
