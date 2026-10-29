import type { CSSProperties, ReactNode, Ref } from "react";

interface TooltipBoxProps {
  /** Ref tới thẻ div để đo kích thước (T2.5) — React 19 cho truyền ref như prop thường. */
  ref?: Ref<HTMLDivElement>;
  /** Toạ độ do bạn tính ở T2.5 (position: fixed, đơn vị px theo viewport). */
  style?: CSSProperties;
  children: ReactNode;
}

/** Chỉ là cái hộp tooltip. Việc hiện khi hover và tính vị trí không tràn màn hình là T2.5. */
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
  /** true khi đang chuyển tab bằng transition (T4.6) — hiện chấm loading cạnh tab. */
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
            <span className="tabs__pending" aria-label="đang tải" />
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

/** Tiêu đề trang + mô tả + vùng nút bên phải. */
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
