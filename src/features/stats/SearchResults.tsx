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
 * memo: only re-renders when props change (shallow comparison). Combined with useDeferredValue in the parent:
 * while typing, the parent renders right away with the OLD deferredQuery → props unchanged → this heavy component is skipped;
 * React renders the new version in the background with the new query, and can abandon it if the user keeps typing.
 * Without memo, useDeferredValue does nothing, because the urgent render still has to recompute the whole list.
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
