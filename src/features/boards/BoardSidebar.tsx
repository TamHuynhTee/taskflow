import type { ReactNode } from "react";
import { NavLink } from "react-router";
import type { Board } from "../../types";
import "./BoardSidebar.css";

interface BoardSidebarProps {
  boards: Board[];
  /** Filter area — pass <FilterPanel /> in (T1.3). */
  filters?: ReactNode;
}

export function BoardSidebar({
  boards,
  filters,
}: BoardSidebarProps) {
  return (
    <nav className="board-sidebar">
      <section>
        <h2 className="board-sidebar__heading">Board</h2>
        <ul className="board-sidebar__list">
          {boards.map((board) => (
            <li key={board.id}>
              {/* T3.1: NavLink sets the "active" class + aria-current="page" when the URL matches. */}
              <NavLink
                to={`/boards/${board.id}`}
                className="board-sidebar__item"
              >
                {board.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </section>

      {filters && (
        <section>
          <h2 className="board-sidebar__heading">Filters</h2>
          {filters}
        </section>
      )}
    </nav>
  );
}
