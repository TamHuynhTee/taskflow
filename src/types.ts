// Data types shared across the app. Match the structure in db.json.
// json-server v1 uses string ids.

export type ColumnId = "todo" | "doing" | "done";

export type Priority = "low" | "medium" | "high" | "urgent";

export type Label = "bug" | "feature" | "design" | "docs" | "chore";

export interface User {
  id: string;
  name: string;
  avatarColor: string;
}

export interface Column {
  id: ColumnId;
  title: string;
}

export interface Board {
  id: string;
  title: string;
  description: string;
  columns: Column[];
  createdAt: string; // ISO date
}

export interface Card {
  id: string;
  boardId: string;
  columnId: ColumnId;
  title: string;
  description: string;
  labels: Label[];
  priority: Priority;
  dueDate: string | null; // ISO date (yyyy-mm-dd)
  assigneeId: string | null;
  order: number; // position in the column, lower is higher up
  createdAt: string;
}

export interface Comment {
  id: string;
  cardId: string;
  authorId: string;
  content: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// UI-only types (not stored on the server)
// ---------------------------------------------------------------------------

export type Theme = "light" | "dark";

/** Sidebar card filter (T1.3). 'all' = don't filter on that field. */
export interface CardFilter {
  labels: Label[];
  priority: Priority | "all";
  assigneeId: string | "all";
}

/** Create/edit card form values (T1.2, T4.3). Text fields use empty strings instead of null to match <input>. */
export interface CardFormValues {
  title: string;
  description: string;
  priority: Priority;
  labels: Label[];
  dueDate: string; // '' if none
  assigneeId: string; // '' if unassigned
}

/** Per-field validation errors; `form` is a general error (e.g. a server error). */
export type CardFormErrors = Partial<
  Record<keyof CardFormValues | "form", string>
>;

/** Comment with a pending flag while it's being sent optimistically (T4.5). */
export type CommentView = Comment & { pending?: boolean };

export interface ToastItem {
  id: string;
  kind: "success" | "error" | "info";
  message: string;
}

/** One row of numbers from <Profiler onRender> (T5.2). */
export interface ProfilerRow {
  id: string;
  phase: "mount" | "update" | "nested-update";
  actualDuration: number;
  baseDuration: number;
  commitTime: number;
}

/** Stats numbers for a board (T5 — the /stats page). */
export interface BoardStats {
  total: number;
  overdue: number;
  unassigned: number;
  byColumn: Record<ColumnId, number>;
  byPriority: Record<Priority, number>;
}
