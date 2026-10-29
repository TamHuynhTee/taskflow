import { Navigate, useLocation, type Location } from "react-router";
import { getUsers } from "../../api/boards";
import { ErrorMessage } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import { useFetch } from "../../hooks/useFetch";
import { LoginView } from "./LoginView";

export function LoginPage() {
  const { user, login } = useAuth();
  const location = useLocation();
  const users = useFetch((signal) => getUsers(signal), []);

  const from = (location.state as { from?: Location } | null)?.from;
  const target = from ? `${from.pathname}${from.search}` : "/boards";

  // Đăng nhập xong → user khác null → render lại → chuyển về trang `from`.
  if (user) return <Navigate to={target} replace />;

  return (
    <>
      <title>Đăng nhập · TaskFlow</title>
      {users.error ? (
        <ErrorMessage
          title="Không tải được danh sách tài khoản"
          error={users.error}
          onRetry={users.reload}
        />
      ) : (
        <LoginView
          users={users.data ?? []}
          loading={users.loading}
          onSelect={login}
        />
      )}
    </>
  );
}
