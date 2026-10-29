// Kiểu dữ liệu dùng chung cho toàn app. Khớp với cấu trúc trong db.json.
// json-server v1 dùng id dạng string.

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
  order: number; // thứ tự trong cột, nhỏ đứng trên
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
// Kiểu dữ liệu cho UI (không lưu trên server)
// ---------------------------------------------------------------------------

export type Theme = "light" | "dark";

/** Bộ lọc card ở sidebar (T1.3). 'all' = không lọc theo trường đó. */
export interface CardFilter {
  labels: Label[];
  priority: Priority | "all";
  assigneeId: string | "all";
}

/** Giá trị form tạo/sửa card (T1.2, T4.3). Field text dùng chuỗi rỗng thay cho null để khớp với <input>. */
export interface CardFormValues {
  title: string;
  description: string;
  priority: Priority;
  labels: Label[];
  dueDate: string; // '' nếu không có
  assigneeId: string; // '' nếu chưa giao
}

/** Lỗi validate theo từng field; `form` là lỗi chung (vd. lỗi server). */
export type CardFormErrors = Partial<
  Record<keyof CardFormValues | "form", string>
>;

/** Comment kèm cờ pending khi đang gửi optimistic (T4.5). */
export type CommentView = Comment & { pending?: boolean };

export interface ToastItem {
  id: string;
  kind: "success" | "error" | "info";
  message: string;
}

/** Một dòng số liệu từ <Profiler onRender> (T5.2). */
export interface ProfilerRow {
  id: string;
  phase: "mount" | "update" | "nested-update";
  actualDuration: number;
  baseDuration: number;
  commitTime: number;
}

/** Số liệu thống kê một board (T5 — trang /stats). */
export interface BoardStats {
  total: number;
  overdue: number;
  unassigned: number;
  byColumn: Record<ColumnId, number>;
  byPriority: Record<Priority, number>;
}
