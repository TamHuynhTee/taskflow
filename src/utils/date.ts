// Pure function: same input → always the same output, reads/writes nothing outside.
// Note that `today` is passed in instead of calling `new Date()` inside — so the
// result doesn't depend on when it's called, and it's easy to test (T6.1).

export type DueStatus = "none" | "overdue" | "soon" | "normal";

const DAY_MS = 24 * 60 * 60 * 1000;
const SOON_DAYS = 2;

/** Converts 'yyyy-mm-dd' to a day number (UTC) for comparison, ignoring the time of day. */
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
