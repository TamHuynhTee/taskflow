import { Suspense } from "react";
import { preconnect } from "react-dom";
import { NavLink, Outlet, useLocation, useMatch } from "react-router";
import { API_URL } from "../api/client";
import { ErrorBoundary } from "../components/ErrorBoundary";
import { ThemeToggle, UserMenu } from "../components/HeaderWidgets";
import { Layout } from "../components/Layout";
import { Banner, ErrorMessage, PageSkeleton } from "../components/ui";
import { useAuth } from "../context/AuthContext";
import { BoardProvider, useBoardState } from "../context/BoardContext";
import { useTheme } from "../context/ThemeContext";
import { BoardSidebar } from "../features/boards/BoardSidebar";
import { FilterPanel } from "../features/boards/FilterPanel";
import { useFilterParams } from "../hooks/useFilterParams";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { useOnlineStatus } from "../hooks/useOnlineStatus";

export function RootLayout() {
  // T4.9: open the connection to the API early (DNS + TCP + TLS), before the first request needs it.
  preconnect(API_URL);

  return (
    <BoardProvider>
      <AppShell />
    </BoardProvider>
  );
}

function AppShell() {
  const { pathname } = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const online = useOnlineStatus();

  return (
    <Layout
      nav={
        <>
          <NavLink to="/boards" className="layout__nav-link">
            Board
          </NavLink>
          <NavLink to="/stats" className="layout__nav-link">
            Stats
          </NavLink>
          <NavLink to="/settings" className="layout__nav-link">
            Settings
          </NavLink>
        </>
      }
      headerActions={<HeaderActions />}
      banner={
        !online && (
          <Banner tone="warning">
            You're offline — changes won't be saved.
          </Banner>
        )
      }
      // T2.6: narrow screen → drop the sidebar; BoardPage shows a "Filters" button that opens a Modal.
      sidebar={isMobile ? undefined : <AppSidebar />}
    >
      {/* resetKeys: an error on one page doesn't "stick" to the next page after navigating. */}
      <ErrorBoundary
        resetKeys={[pathname]}
        fallback={(error, reset) => <ErrorMessage error={error} onRetry={reset} />}
      >
        <Suspense fallback={<PageSkeleton />}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}

/**
 * Split out so only the header reads ThemeContext/AuthContext (T5.4c): changing the theme only
 * re-renders this component (+ whatever calls useTheme), not the whole board.
 */
function HeaderActions() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  return (
    <>
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      {user && <UserMenu user={user} onLogout={logout} />}
    </>
  );
}

function AppSidebar() {
  const { boards, users } = useBoardState();
  const onBoard = useMatch("/boards/:boardId/*");
  return (
    <BoardSidebar
      boards={boards}
      filters={onBoard && <SidebarFilters users={users} />}
    />
  );
}

function SidebarFilters({ users }: { users: ReturnType<typeof useBoardState>["users"] }) {
  const [{ filter }, setParams] = useFilterParams();
  return (
    <FilterPanel
      value={filter}
      onChange={(next) => setParams({ filter: next })}
      users={users}
    />
  );
}
