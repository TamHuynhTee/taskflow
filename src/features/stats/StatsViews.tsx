// UI blocks for the /stats page (Levels 4–5). The numbers, filtering and measuring are your part.
import type { CSSProperties, ReactNode, Ref, UIEventHandler } from "react";
import { Avatar, Badge, EmptyState, StatTile } from "../../components/ui";
import type {
  BoardStats,
  Card,
  ColumnId,
  Priority,
  ProfilerRow,
  User,
} from "../../types";
import { labelMeta, priorityMeta } from "../cards/cardMeta";
import "./StatsViews.css";

const columnText: Record<ColumnId, string> = {
  todo: "To do",
  doing: "In progress",
  done: "Done",
};

/** Stat tiles + bar charts. You compute `stats` with computeBoardStats (T5.3). */
export function StatsOverview({ stats }: { stats: BoardStats }) {
  const pct = (n: number) =>
    stats.total === 0 ? 0 : Math.round((n / stats.total) * 100);

  return (
    <div className="stats-overview">
      <div className="stats-overview__tiles">
        <StatTile
          label="Total cards"
          value={stats.total.toLocaleString("en-US")}
        />
        <StatTile
          label="Done"
          value={`${pct(stats.byColumn.done)}%`}
          tone="success"
          hint={`${stats.byColumn.done} card`}
        />
        <StatTile
          label="Overdue"
          value={stats.overdue}
          tone={stats.overdue > 0 ? "danger" : "default"}
        />
        <StatTile
          label="Unassigned"
          value={stats.unassigned}
          tone={stats.unassigned > 0 ? "warning" : "default"}
        />
      </div>

      <div className="stats-overview__bars">
        <BarGroup
          title="By column"
          rows={(Object.keys(columnText) as ColumnId[]).map((k) => ({
            label: columnText[k],
            value: stats.byColumn[k],
            pct: pct(stats.byColumn[k]),
          }))}
        />
        <BarGroup
          title="By priority"
          rows={(Object.keys(priorityMeta) as Priority[]).map((k) => ({
            label: priorityMeta[k].text,
            value: stats.byPriority[k],
            pct: pct(stats.byPriority[k]),
          }))}
        />
      </div>
    </div>
  );
}

function BarGroup({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; value: number; pct: number }[];
}) {
  return (
    <section className="bar-group">
      <h3 className="bar-group__title">{title}</h3>
      {rows.map((r) => (
        <div key={r.label} className="bar-group__row">
          <span className="bar-group__label">{r.label}</span>
          <span className="bar-group__track">
            <span className="bar-group__fill" style={{ width: `${r.pct}%` }} />
          </span>
          <span className="bar-group__value">{r.value}</span>
        </div>
      ))}
    </section>
  );
}

interface ProfilerTableProps {
  rows: ProfilerRow[];
  onClear?: () => void;
}

/** Table of numbers from <Profiler onRender> (T5.2). You collect the `rows` yourself. */
export function ProfilerTable({ rows, onClear }: ProfilerTableProps) {
  return (
    <section className="profiler-table">
      <header className="profiler-table__header">
        <h3>Profiler — last {rows.length} commits</h3>
        {onClear && (
          <button
            type="button"
            className="profiler-table__clear"
            onClick={onClear}
          >
            Clear
          </button>
        )}
      </header>
      {rows.length === 0 ? (
        <p className="profiler-table__empty">
          No data yet. Interact with the page to record commits.
        </p>
      ) : (
        <div className="profiler-table__scroll">
          <table>
            <thead>
              <tr>
                <th>Id</th>
                <th>Phase</th>
                <th>actual (ms)</th>
                <th>base (ms)</th>
                <th>commit (ms)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={`${r.commitTime}-${r.id}-${i}`}>
                  <td>{r.id}</td>
                  <td>
                    <Badge tone={r.phase === "mount" ? "purple" : "blue"}>
                      {r.phase}
                    </Badge>
                  </td>
                  <td
                    className={
                      r.actualDuration > 16 ? "profiler-table__slow" : ""
                    }
                  >
                    {r.actualDuration.toFixed(2)}
                  </td>
                  <td>{r.baseDuration.toFixed(2)}</td>
                  <td>{r.commitTime.toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

/** Fixed height of 1 CardRow — used when you write VirtualList yourself (T5.5). */
export const CARD_ROW_HEIGHT = 44;

interface CardRowProps {
  card: Card;
  assignee: User | undefined;
  /** VirtualList passes { position: 'absolute', top, ... } in here. */
  style?: CSSProperties;
  /** Search text to highlight in the title. */
  highlight?: string;
}

/** A compact card row for long lists (T4.7, T5.x). */
export function CardRow({ card, assignee, style, highlight }: CardRowProps) {
  return (
    <div className="card-row" style={{ height: CARD_ROW_HEIGHT, ...style }}>
      <span
        className={`card-row__dot card-row__dot--${card.priority}`}
        title={priorityMeta[card.priority].text}
      />
      <span className="card-row__title">
        {highlightText(card.title, highlight)}
      </span>
      <span className="card-row__labels">
        {card.labels.map((l) => (
          <Badge key={l} tone={labelMeta[l].tone}>
            {labelMeta[l].text}
          </Badge>
        ))}
      </span>
      <span className="card-row__col">{columnText[card.columnId]}</span>
      {assignee ? (
        <Avatar user={assignee} size={22} />
      ) : (
        <span className="card-row__avatar-empty" />
      )}
    </div>
  );
}

function highlightText(text: string, query?: string): ReactNode {
  const q = query?.trim();
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

interface ListFrameProps {
  /** Height of the scroll area (px). */
  height: number;
  ref?: Ref<HTMLDivElement>;
  onScroll?: UIEventHandler<HTMLDivElement>;
  /** Result count shown at the top of the area. */
  count?: number;
  isStale?: boolean;
  children: ReactNode;
}

/** Scroll area for a list of CardRows. Render the CardRows inside yourself (or VirtualList in T5.5). */
export function ListFrame({
  height,
  ref,
  onScroll,
  count,
  isStale = false,
  children,
}: ListFrameProps) {
  return (
    <section className={`list-frame ${isStale ? "list-frame--stale" : ""}`}>
      {count !== undefined && (
        <p className="list-frame__count">
          {count.toLocaleString("en-US")} results
        </p>
      )}
      <div
        ref={ref}
        className="list-frame__scroll"
        style={{ height }}
        onScroll={onScroll}
      >
        {count === 0 ? (
          <EmptyState icon="🔎" title="No matching cards" />
        ) : (
          children
        )}
      </div>
    </section>
  );
}
