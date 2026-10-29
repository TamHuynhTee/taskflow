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
 * T5.5 — chỉ render các dòng đang nằm trong khung nhìn (+ `overscan` dòng đệm mỗi phía).
 * 5.000 kết quả nhưng DOM chỉ có ~ height/itemHeight + 2*overscan dòng.
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
      {/* Div "giả" cao bằng toàn bộ danh sách để thanh cuộn đúng kích thước. */}
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
