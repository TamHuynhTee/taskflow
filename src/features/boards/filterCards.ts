import type { Card, CardFilter } from "../../types";

/**
 * Lọc card theo bộ lọc + từ khoá (T1.3). Card phải khớp TẤT CẢ điều kiện.
 * Hàm thuần → gọi thẳng lúc render, không lưu kết quả vào state (T2.2).
 */
export function filterCards(
  cards: Card[],
  filter: CardFilter,
  query: string,
): Card[] {
  const q = query.trim().toLowerCase();
  return cards.filter(
    (c) =>
      (filter.labels.length === 0 ||
        c.labels.some((l) => filter.labels.includes(l))) &&
      (filter.priority === "all" || c.priority === filter.priority) &&
      (filter.assigneeId === "all" || c.assigneeId === filter.assigneeId) &&
      (q === "" ||
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)),
  );
}
