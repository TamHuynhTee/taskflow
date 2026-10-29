import type { ReactNode } from "react";
import "./Layout.css";

interface LayoutProps {
  // Composition: Layout doesn't need to know what the sidebar/content is; the parent passes the JSX in.
  // That way board data doesn't have to "pass through" Layout (avoids prop drilling).
  sidebar?: ReactNode;
  children: ReactNode;
  /** Navigation links in the header (T3.1). Use <NavLink className="layout__nav-link">. */
  nav?: ReactNode;
  /** Right side of the header: ThemeToggle, UserMenu (T3.2). */
  headerActions?: ReactNode;
  /** Notice strip below the header, e.g. an offline <Banner> (T2.6). */
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

/** Only for before T3.1, when there is no router: a fake link styled like NavLink. */
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
