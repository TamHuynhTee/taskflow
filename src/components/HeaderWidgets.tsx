import type { Theme, User } from "../types";
import { Avatar } from "./Avatar";
import { Button, IconButton } from "./ui";
import "./HeaderWidgets.css";

/** Theme toggle button. Persisting the theme and setting data-theme on <html> is T3.2. */
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
          ? "Switch to light theme"
          : "Switch to dark theme"
      }
      onClick={onToggle}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </IconButton>
  );
}

/** Signed-in user + sign-out button (T3.2). */
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
        Sign out
      </Button>
    </div>
  );
}
