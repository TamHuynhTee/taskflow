import type { CSSProperties, ReactNode, Ref } from "react";

interface TooltipBoxProps {
  /** Ref to the div, for measuring its size (T2.5) — React 19 lets you pass ref as a regular prop. */
  ref?: Ref<HTMLDivElement>;
  /** Coordinates you compute in T2.5 (position: fixed, px relative to the viewport). */
  style?: CSSProperties;
  children: ReactNode;
}

/** Just the tooltip box. Showing it on hover and positioning it so it doesn't overflow the screen is T2.5. */
export function TooltipBox({ ref, style, children }: TooltipBoxProps) {
  return (
    <div ref={ref} className="tooltip" role="tooltip" style={style}>
      {children}
    </div>
  );
}

export interface TabItem {
  id: string;
  label: string;
}

interface TabsProps {
  items: TabItem[];
  activeId: string;
  onSelect: (id: string) => void;
  /** true while switching tabs in a transition (T4.6) — shows a loading dot next to the tab. */
  pendingId?: string | null;
}

export function Tabs({ items, activeId, onSelect, pendingId }: TabsProps) {
  return (
    <div className="tabs" role="tablist">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={item.id === activeId}
          className="tabs__tab"
          onClick={() => onSelect(item.id)}
        >
          {item.label}
          {pendingId === item.id && (
            <span className="tabs__pending" aria-label="loading" />
          )}
        </button>
      ))}
    </div>
  );
}

interface StatTileProps {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "default" | "danger" | "warning" | "success";
}

export function StatTile({
  label,
  value,
  hint,
  tone = "default",
}: StatTileProps) {
  return (
    <div className={`stat-tile stat-tile--${tone}`}>
      <p className="stat-tile__label">{label}</p>
      <p className="stat-tile__value">{value}</p>
      {hint && <p className="stat-tile__hint">{hint}</p>}
    </div>
  );
}

/** Page title + description + a button area on the right. */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div>
        <h2 className="page-header__title">{title}</h2>
        {description && <p className="page-header__desc">{description}</p>}
      </div>
      {actions && <div className="page-header__actions">{actions}</div>}
    </header>
  );
}
