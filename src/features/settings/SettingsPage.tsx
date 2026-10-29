import { API_URL } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { SettingsView } from "./SettingsView";

/** /settings — lazy-load (T4.1) nên phải `export default`. */
export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <>
      <title>Cài đặt · TaskFlow</title>
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
