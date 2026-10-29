// Hàm thuần (pure): cùng input → luôn cùng output, không đọc/ghi gì bên ngoài.
// Chú ý `today` được truyền vào thay vì gọi `new Date()` bên trong — nhờ vậy
// kết quả không phụ thuộc vào thời điểm gọi và dễ test (T6.1).

export type DueStatus = "none" | "overdue" | "soon" | "normal";

const DAY_MS = 24 * 60 * 60 * 1000;
const SOON_DAYS = 2;

/** Chuyển 'yyyy-mm-dd' thành số ngày (UTC) để so sánh, bỏ qua giờ phút. */
function toDayNumber(isoDate: string) {
  const [y, m, d] = isoDate.slice(0, 10).split("-").map(Number);
  return Date.UTC(y, m - 1, d) / DAY_MS;
}

export function getDueStatus(dueDate: string | null, today: string): DueStatus {
  if (!dueDate) return "none";
  const diff = toDayNumber(dueDate) - toDayNumber(today);
  if (diff < 0) return "overdue";
  if (diff <= SOON_DAYS) return "soon";
  return "normal";
}

/** '2026-10-28' → '28/10' */
export function formatDueDate(dueDate: string) {
  const [, m, d] = dueDate.slice(0, 10).split("-");
  return `${d}/${m}`;
}

/** Today with format 'yyyy-mm-dd' */
export function todayIso() {
  const now = new Date();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${m}-${d}`;
}
