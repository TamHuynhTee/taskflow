import {
  Activity,
  Profiler,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getAllCards } from "../../api/cards";
import { TODAY } from "../../app/today";
import {
  ErrorMessage,
  PageHeader,
  PageSkeleton,
  Tabs,
} from "../../components/ui";
import { useBoardState } from "../../context/BoardContext";
import { useFetch } from "../../hooks/useFetch";
import type { Card, User } from "../../types";
import { SearchBox } from "../boards/SearchBox";
import { computeBoardStats } from "./computeStats";
import { clear, onRender, useProfilerRows } from "./profilerStore";
import { SearchResults } from "./SearchResults";
import { ProfilerTable, StatsOverview } from "./StatsViews";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "search", label: "Search" },
  { id: "profiler", label: "Profiler" },
];

/**
 * T4.8 — each tab is wrapped in <Activity>. A hidden tab keeps its state (typed text, scroll position) and DOM,
 * but its effects are cleaned up and its updates get low priority. Compare with
 * `{tab === "search" && <SearchPanel />}`: that unmounts → all state is lost when switching tabs.
 */
export default function StatsPage() {
  const { usersById } = useBoardState();
  const all = useFetch((signal) => getAllCards(signal), []);
  const [tab, setTab] = useState("overview");

  // T5.3: computeBoardStats walks all 5,000 cards — only recompute when the data changes,
  // not when switching tabs or typing a search.
  const stats = useMemo(
    () => (all.data ? computeBoardStats(all.data, TODAY) : null),
    [all.data],
  );

  const mode = (id: string) => (tab === id ? "visible" : "hidden");

  return (
    <>
      <title>Stats · TaskFlow</title>
      <meta name="description" content="Numbers and search across every card" />
      <PageHeader title="Stats" description="Every card on every board" />
      <Tabs items={TABS} activeId={tab} onSelect={setTab} />

      {all.error ? (
        <ErrorMessage error={all.error} onRetry={all.reload} />
      ) : !all.data || !stats ? (
        <PageSkeleton />
      ) : (
        <>
          <Activity mode={mode("overview")}>
            <StatsOverview stats={stats} />
          </Activity>
          <Activity mode={mode("search")}>
            <SearchPanel cards={all.data} usersById={usersById} />
          </Activity>
          <Activity mode={mode("profiler")}>
            <ProfilerPanel />
          </Activity>
        </>
      )}
    </>
  );
}

function SearchPanel({
  cards,
  usersById,
}: {
  cards: Card[];
  usersById: Record<string, User>;
}) {
  // Controlled, NO debounce: the input updates immediately on every keystroke (T4.7).
  const [query, setQuery] = useState("");
  // Unlike debounce: debounce always waits a fixed N ms even on fast machines; useDeferredValue has
  // no fixed delay — on a fast machine it's nearly instant, on a slow one React defers and abandons
  // half-finished renders when a new key arrives. Debounce is still the right tool to CUT NETWORK REQUESTS.
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  // Watch <Activity>: switch to another tab → cleanup runs; come back → the effect runs again.
  useEffect(() => {
    console.debug("[stats] SearchPanel effect mount");
    return () => console.debug("[stats] SearchPanel effect cleanup");
  }, []);

  return (
    <div className="stats-search">
      <SearchBox
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onClear={query ? () => setQuery("") : undefined}
        busy={isStale}
        placeholder="Search 5,000 cards…"
      />
      <Profiler id="SearchResults" onRender={onRender}>
        <SearchResults
          cards={cards}
          query={deferredQuery}
          usersById={usersById}
          isStale={isStale}
        />
      </Profiler>
    </div>
  );
}

function ProfilerPanel() {
  const rows = useProfilerRows();
  return <ProfilerTable rows={rows} onClear={clear} />;
}
