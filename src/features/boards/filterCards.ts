import type { Card, CardFilter } from "../../types";

/**
 * Filters cards by the filter + search text (T1.3). A card must match ALL conditions.
 * Pure function → call it directly during render, don't store the result in state (T2.2).
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
