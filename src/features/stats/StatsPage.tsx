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
  { id: "overview", label: "Tổng quan" },
  { id: "search", label: "Tìm kiếm" },
  { id: "profiler", label: "Profiler" },
];

/**
 * T4.8 — mỗi tab bọc <Activity>. Tab ẩn vẫn giữ state (chữ đã gõ, vị trí cuộn) và DOM,
 * nhưng effect của nó bị dọn (cleanup) và update được ưu tiên thấp. So với
 * `{tab === "search" && <SearchPanel />}`: cách đó unmount → mất sạch state khi đổi tab.
 */
export default function StatsPage() {
  const { usersById } = useBoardState();
  const all = useFetch((signal) => getAllCards(signal), []);
  const [tab, setTab] = useState("overview");

  // T5.3: computeBoardStats duyệt toàn bộ 5.000 card — chỉ tính lại khi dữ liệu đổi,
  // không tính lại khi đổi tab hay gõ tìm kiếm.
  const stats = useMemo(
    () => (all.data ? computeBoardStats(all.data, TODAY) : null),
    [all.data],
  );

  const mode = (id: string) => (tab === id ? "visible" : "hidden");

  return (
    <>
      <title>Thống kê · TaskFlow</title>
      <meta name="description" content="Số liệu và tìm kiếm toàn bộ card" />
      <PageHeader title="Thống kê" description="Toàn bộ card trên mọi board" />
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
  // Controlled, KHÔNG debounce: ô input cập nhật ngay mỗi phím (T4.7).
  const [query, setQuery] = useState("");
  // Khác debounce: debounce luôn chờ cố định N ms kể cả máy nhanh; useDeferredValue không
  // có độ trễ cố định — máy nhanh thì gần như tức thì, máy chậm thì React tự hoãn và bỏ
  // các lần render dang dở khi có phím mới. Debounce còn hợp để GIẢM SỐ REQUEST mạng.
  const deferredQuery = useDeferredValue(query);
  const isStale = query !== deferredQuery;

  // Quan sát <Activity>: sang tab khác → cleanup chạy; quay lại → effect chạy lại.
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
        placeholder="Tìm trong 5.000 card…"
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
