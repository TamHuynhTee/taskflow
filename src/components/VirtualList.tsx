import { useState, type CSSProperties, type ReactNode } from "react";
import { ListFrame } from "../features/stats/StatsViews";

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  height: number;
  overscan?: number;
  isStale?: boolean;
  renderItem: (item: T, index: number, style: CSSProperties) => ReactNode;
}

/**
 * T5.5 — only renders the rows inside the viewport (+ `overscan` buffer rows on each side).
 * 5,000 results, but the DOM only holds ~ height/itemHeight + 2*overscan rows.
 */
export function VirtualList<T>({
  items,
  itemHeight,
  height,
  overscan = 5,
  isStale,
  renderItem,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);

  const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const end = Math.min(
    items.length,
    Math.ceil((scrollTop + height) / itemHeight) + overscan,
  );

  return (
    <ListFrame
      height={height}
      count={items.length}
      isStale={isStale}
      onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
    >
      {/* A "fake" div as tall as the whole list so the scrollbar has the right size. */}
      <div style={{ position: "relative", height: items.length * itemHeight }}>
        {items
          .slice(start, end)
          .map((item, i) =>
            renderItem(item, start + i, {
              position: "absolute",
              top: (start + i) * itemHeight,
              left: 0,
              right: 0,
            }),
          )}
      </div>
    </ListFrame>
  );
}
