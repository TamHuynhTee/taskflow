import "../../features/boards/BoardView.css";
import "../../features/boards/Column.css";

export function Spinner({
  size = 20,
  label = "Loading",
}: {
  size?: number;
  label?: string;
}) {
  return (
    <span
      className="spinner"
      role="status"
      aria-label={label}
      style={{ width: size, height: size }}
    />
  );
}

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  radius?: number;
}

export function Skeleton({
  width = "100%",
  height = 16,
  radius = 6,
}: SkeletonProps) {
  return (
    <span
      className="skeleton"
      style={{ width, height, borderRadius: radius }}
      aria-hidden
    />
  );
}

/** Placeholder 3-column board — fallback for loading/Suspense (T2.1, T4.1, T4.6). */
export function BoardSkeleton() {
  return (
    <div className="board" aria-busy>
      <div className="board__header">
        <Skeleton width={220} height={24} />
        <div style={{ marginTop: 8 }}>
          <Skeleton width={320} height={14} />
        </div>
      </div>
      <div className="board__columns">
        {[4, 3, 2].map((n, col) => (
          <div key={col} className="column">
            <Skeleton width={90} height={16} />
            {Array.from({ length: n }, (_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card-skeleton">
      <Skeleton width={60} height={18} radius={999} />
      <Skeleton height={16} />
      <Skeleton width="70%" height={12} />
    </div>
  );
}

/** Shared fallback for lazy-loaded pages (T4.1). */
export function PageSkeleton() {
  return (
    <div className="page-skeleton" aria-busy>
      <Skeleton width={200} height={28} />
      <Skeleton height={14} />
      <Skeleton width="80%" height={14} />
      <div className="page-skeleton__grid">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} height={88} radius={12} />
        ))}
      </div>
    </div>
  );
}
