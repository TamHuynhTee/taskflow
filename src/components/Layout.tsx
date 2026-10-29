import type { ReactNode } from "react";
import "./Layout.css";

interface LayoutProps {
  // Composition: Layout không cần biết sidebar/nội dung là gì, cha tự truyền JSX vào.
  // Nhờ vậy dữ liệu board không phải "đi xuyên" qua Layout (tránh props drilling).
  sidebar?: ReactNode;
  children: ReactNode;
  /** Link điều hướng trên header (T3.1). Dùng <NavLink className="layout__nav-link">. */
  nav?: ReactNode;
  /** Góc phải header: ThemeToggle, UserMenu (T3.2). */
  headerActions?: ReactNode;
  /** Dải thông báo dưới header, vd. <Banner> mất kết nối (T2.6). */
  banner?: ReactNode;
}

export function Layout({
  sidebar,
  children,
  nav,
  headerActions,
  banner,
}: LayoutProps) {
  return (
    <div className={`layout ${sidebar ? "" : "layout--no-sidebar"}`}>
      <header className="layout__header">
        <h1 className="layout__logo">TaskFlow</h1>
        {nav && <nav className="layout__nav">{nav}</nav>}
        <div className="layout__header-actions">{headerActions}</div>
      </header>
      {banner && <div className="layout__banner">{banner}</div>}
      {sidebar && <aside className="layout__sidebar">{sidebar}</aside>}
      <main className="layout__main">{children}</main>
    </div>
  );
}

/** Chỉ dùng trước T3.1 khi chưa có router: link giả có cùng style với NavLink. */
export function NavLinkPlaceholder({
  children,
  active = false,
}: {
  children: ReactNode;
  active?: boolean;
}) {
  return (
    <a
      href="#"
      className={`layout__nav-link ${active ? "active" : ""}`}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </a>
  );
}
