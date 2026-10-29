import { useSearchParams } from "react-router";
import type { CardFilter } from "../types";
import { isLabel, isPriority } from "../features/cards/cardMeta";

interface FilterParams {
  filter: CardFilter;
  query: string;
}

/**
 * URL là state (T3.1): ?label=bug&label=docs&priority=high&assignee=u1&q=login.
 * Refresh / chia sẻ link / Back-Forward đều giữ đúng bộ lọc.
 */
export function useFilterParams(): [
  FilterParams,
  (next: Partial<FilterParams>) => void,
] {
  const [params, setParams] = useSearchParams();

  const priority = params.get("priority");
  const value: FilterParams = {
    filter: {
      labels: params.getAll("label").filter(isLabel),
      priority: isPriority(priority) ? priority : "all",
      assigneeId: params.get("assignee") ?? "all",
    },
    query: params.get("q") ?? "",
  };

  function update(next: Partial<FilterParams>) {
    setParams(
      (prev) => {
        const p = new URLSearchParams(prev);
        if (next.filter) {
          const { labels, priority, assigneeId } = next.filter;
          p.delete("label");
          labels.forEach((l) => p.append("label", l));
          if (priority === "all") p.delete("priority");
          else p.set("priority", priority);
          if (assigneeId === "all") p.delete("assignee");
          else p.set("assignee", assigneeId);
        }
        if (next.query !== undefined) {
          if (next.query) p.set("q", next.query);
          else p.delete("q");
        }
        return p;
      },
      // Gõ tìm kiếm không nên tạo một mục lịch sử cho mỗi lần đổi.
      { replace: next.query !== undefined && !next.filter },
    );
  }

  return [value, update];
}
