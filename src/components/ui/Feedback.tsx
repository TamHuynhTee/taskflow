// Status blocks: empty, error, banner, toast.
import type { ReactNode } from "react";
import type { ToastItem } from "../../types";
import { errorText } from "../../utils/error";
import { Button, IconButton } from "./Button";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon = "📭",
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon" aria-hidden>
        {icon}
      </div>
      <p className="empty-state__title">{title}</p>
      {description && <p className="empty-state__desc">{description}</p>}
      {action}
    </div>
  );
}

interface ErrorMessageProps {
  title?: string;
  error: unknown;
  onRetry?: () => void;
  /** Compact version for a single column/small block. */
  compact?: boolean;
}

/** Shows an error + a retry button. Used for failed fetches (T2.1) and as the ErrorBoundary fallback (T3.7). */
export function ErrorMessage({
  title = "Something went wrong",
  error,
  onRetry,
  compact = false,
}: ErrorMessageProps) {
  return (
    <div
      className={`error-box ${compact ? "error-box--compact" : ""}`}
      role="alert"
    >
      <p className="error-box__title">⚠ {title}</p>
      <p className="error-box__detail">{errorText(error)}</p>
      {onRetry && (
        <Button size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}

interface BannerProps {
  tone?: "info" | "warning" | "error";
  children: ReactNode;
  action?: ReactNode;
}

/** Notice strip at the top of the page — e.g. "Offline" (T2.6). Pass it to Layout's `banner` prop. */
export function Banner({ tone = "info", children, action }: BannerProps) {
  return (
    <div
      className={`banner banner--${tone}`}
      role={tone === "info" ? "status" : "alert"}
    >
      <span>{children}</span>
      {action}
    </div>
  );
}

interface ToastStackProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

/**
 * Only displays the toast list. Adding toasts and auto-hiding them after a few seconds (setTimeout + cleanup)
 * is your part (T4.5).
 */
export function ToastStack({ toasts, onDismiss }: ToastStackProps) {
  return (
    <div className="toast-stack" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast toast--${t.kind}`}
          role={t.kind === "error" ? "alert" : "status"}
        >
          <span>{t.message}</span>
          <IconButton label="Dismiss notification" onClick={() => onDismiss(t.id)}>
            ✕
          </IconButton>
        </div>
      ))}
    </div>
  );
}

/** Small badge showing the render count (T2.3). You count `count` yourself with useRef. */
export function RenderCounter({
  count,
  label = "renders",
}: {
  count: number;
  label?: string;
}) {
  return (
    <span className="render-counter" title="How many times this component has rendered">
      {count} {label}
    </span>
  );
}
