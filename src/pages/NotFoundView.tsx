import type { ReactNode } from "react";
import { EmptyState } from "../components/ui";

/** Trang 404 (T3.1). Truyền <Link to="/boards">Về trang chủ</Link> vào `action`. */
export function NotFoundView({ action }: { action?: ReactNode }) {
  return (
    <EmptyState
      icon="🧭"
      title="Không tìm thấy trang"
      description="Đường dẫn không tồn tại hoặc board đã bị xoá."
      action={action}
    />
  );
}
