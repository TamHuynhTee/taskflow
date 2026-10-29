import { lazy } from "react";
import { createBrowserRouter, Link, Navigate } from "react-router";
import { RequireAuth } from "../features/auth/RequireAuth";
import { LoginPage } from "../features/auth/LoginPage";
import { BoardRoute, BoardsIndex } from "../features/boards/BoardRoute";
import { CardDetailRoute } from "../features/cards/CardDetailRoute";
import { NotFoundView } from "../pages/NotFoundView";
import { RootLayout } from "./RootLayout";

// T4.1: mỗi trang lazy là một chunk JS riêng, chỉ tải khi mở trang lần đầu.
const StatsPage = lazy(() => import("../features/stats/StatsPage"));
const SettingsPage = lazy(() => import("../features/settings/SettingsPage"));
const LabsPage = lazy(() => import("../labs/LabsPage"));

export const routes = [
  { path: "/login", element: <LoginPage /> },
  // Bài tập React nâng cao — không cần đăng nhập, không cần API.
  { path: "/labs/:labId?", element: <LabsPage /> },
  {
    path: "/",
    element: (
      <RequireAuth>
        <RootLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/boards" replace /> },
      { path: "boards", element: <BoardsIndex /> },
      {
        path: "boards/:boardId",
        element: <BoardRoute />,
        children: [{ path: "cards/:cardId", element: <CardDetailRoute /> }],
      },
      { path: "stats", element: <StatsPage /> },
      { path: "settings", element: <SettingsPage /> },
      {
        path: "*",
        element: <NotFoundView action={<Link to="/boards">Về trang board</Link>} />,
      },
    ],
  },
];

export function createAppRouter() {
  return createBrowserRouter(routes);
}
