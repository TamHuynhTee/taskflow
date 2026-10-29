// Các khối thông báo trạng thái: rỗng, lỗi, banner, toast.
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
  /** Bản gọn để đặt trong 1 cột/khối nhỏ. */
  compact?: boolean;
}

/** Hiện lỗi + nút thử lại. Dùng cho fetch lỗi (T2.1) và fallback của ErrorBoundary (T3.7). */
export function ErrorMessage({
  title = "Đã có lỗi xảy ra",
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
          Thử lại
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

/** Dải thông báo trên cùng trang — vd. "Mất kết nối" (T2.6). Đặt vào prop `banner` của Layout. */
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
 * Chỉ hiển thị danh sách toast. Việc thêm toast, tự ẩn sau vài giây (setTimeout + cleanup)
 * là phần bạn tự làm (T4.5).
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
          <IconButton label="Đóng thông báo" onClick={() => onDismiss(t.id)}>
            ✕
          </IconButton>
        </div>
      ))}
    </div>
  );
}

/** Huy hiệu nhỏ hiện số lần render (T2.3). Giá trị `count` do bạn tự đếm bằng useRef. */
export function RenderCounter({
  count,
  label = "renders",
}: {
  count: number;
  label?: string;
}) {
  return (
    <span className="render-counter" title="Số lần component này đã render">
      {count} {label}
    </span>
  );
}
