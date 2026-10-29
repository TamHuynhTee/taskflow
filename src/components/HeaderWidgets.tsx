import type { Theme, User } from "../types";
import { Avatar } from "./Avatar";
import { Button, IconButton } from "./ui";
import "./HeaderWidgets.css";

/** Nút đổi theme. Việc lưu theme và gắn data-theme lên <html> là T3.2. */
export function ThemeToggle({
  theme,
  onToggle,
}: {
  theme: Theme;
  onToggle: () => void;
}) {
  return (
    <IconButton
      label={
        theme === "dark"
          ? "Chuyển sang giao diện sáng"
          : "Chuyển sang giao diện tối"
      }
      onClick={onToggle}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </IconButton>
  );
}

/** Người dùng đang đăng nhập + nút đăng xuất (T3.2). */
export function UserMenu({
  user,
  onLogout,
}: {
  user: User;
  onLogout: () => void;
}) {
  return (
    <div className="user-menu">
      <Avatar user={user} size={28} />
      <span className="user-menu__name">{user.name}</span>
      <Button size="sm" variant="ghost" onClick={onLogout}>
        Đăng xuất
      </Button>
    </div>
  );
}
