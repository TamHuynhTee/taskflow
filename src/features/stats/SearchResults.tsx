import { memo } from "react";
import { VirtualList } from "../../components/VirtualList";
import type { Card, User } from "../../types";
import { filterCards } from "../boards/filterCards";
import { EMPTY_FILTER } from "../cards/cardMeta";
import { CARD_ROW_HEIGHT, CardRow } from "./StatsViews";

interface SearchResultsProps {
  cards: Card[];
  query: string;
  usersById: Record<string, User>;
  isStale?: boolean;
}

/**
 * memo: chỉ render lại khi props đổi (so sánh nông). Kết hợp useDeferredValue ở cha:
 * khi gõ, cha render ngay với deferredQuery CŨ → props không đổi → bỏ qua component nặng này;
 * React render bản mới ở nền với query mới, và huỷ được nếu người dùng gõ tiếp.
 * Không có memo thì useDeferredValue vô tác dụng, vì lần render gấp vẫn phải tính lại cả danh sách.
 */
export const SearchResults = memo(function SearchResults({
  cards,
  query,
  usersById,
  isStale,
}: SearchResultsProps) {
  const results = filterCards(cards, EMPTY_FILTER, query);

  return (
    <VirtualList
      items={results}
      itemHeight={CARD_ROW_HEIGHT}
      height={480}
      isStale={isStale}
      renderItem={(card, _i, style) => (
        <CardRow
          key={card.id}
          card={card}
          assignee={card.assigneeId ? usersById[card.assigneeId] : undefined}
          highlight={query}
          style={style}
        />
      )}
    />
  );
});
