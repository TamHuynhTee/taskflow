import { API_URL } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { SettingsView } from "./SettingsView";

/** /settings — lazy-loaded (T4.1), so it must be an `export default`. */
export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <>
      <title>Settings · TaskFlow</title>
      <SettingsView
        theme={theme}
        onThemeChange={setTheme}
        user={user}
        onLogout={logout}
        apiUrl={API_URL}
        apiDelay={Number(import.meta.env.VITE_API_DELAY ?? 500)}
      />
    </>
  );
}
