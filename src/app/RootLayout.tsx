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
  // T4.9: mở sẵn kết nối tới API (DNS + TCP + TLS) trước khi request đầu tiên cần tới.
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
            Thống kê
          </NavLink>
          <NavLink to="/settings" className="layout__nav-link">
            Cài đặt
          </NavLink>
        </>
      }
      headerActions={<HeaderActions />}
      banner={
        !online && (
          <Banner tone="warning">
            Mất kết nối mạng — thay đổi sẽ không được lưu.
          </Banner>
        )
      }
      // T2.6: màn hình hẹp → bỏ sidebar, BoardPage hiện nút "Bộ lọc" mở Modal.
      sidebar={isMobile ? undefined : <AppSidebar />}
    >
      {/* resetKeys: lỗi ở một trang không "dính" sang trang khác sau khi điều hướng. */}
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
 * Tách riêng để chỉ phần header đọc ThemeContext/AuthContext (T5.4c): đổi theme chỉ render
 * lại component này (+ những nơi useTheme), không kéo cả board render lại.
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
