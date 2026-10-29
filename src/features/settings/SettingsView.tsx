import { Avatar, Button, PageHeader } from "../../components/ui";
import type { Theme, User } from "../../types";
import "./SettingsView.css";

interface SettingsViewProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  user: User | null;
  onLogout: () => void;
  /** Environment info, shown just for fun (read from import.meta.env). */
  apiUrl?: string;
  apiDelay?: number;
}

/** The /settings page (T3.2, lazy-loaded in T4.1). */
export function SettingsView({
  theme,
  onThemeChange,
  user,
  onLogout,
  apiUrl,
  apiDelay,
}: SettingsViewProps) {
  return (
    <div className="settings">
      <PageHeader title="Settings" description="Appearance and account" />

      <section className="settings__section">
        <h3 className="settings__title">Appearance</h3>
        <div className="settings__themes" role="radiogroup" aria-label="Theme">
          {(["light", "dark"] as const).map((t) => (
            <label key={t} className="settings__theme">
              <input
                type="radio"
                name="theme"
                value={t}
                checked={theme === t}
                onChange={() => onThemeChange(t)}
              />
              <span
                className={`settings__swatch settings__swatch--${t}`}
                aria-hidden
              />
              {t === "light" ? "Light" : "Dark"}
            </label>
          ))}
        </div>
      </section>

      <section className="settings__section">
        <h3 className="settings__title">Account</h3>
        {user ? (
          <div className="settings__account">
            <Avatar user={user} size={40} />
            <div>
              <p className="settings__name">{user.name}</p>
              <p className="settings__muted">ID: {user.id}</p>
            </div>
            <Button variant="danger" size="sm" onClick={onLogout}>
              Sign out
            </Button>
          </div>
        ) : (
          <p className="settings__muted">Not signed in.</p>
        )}
      </section>

      {(apiUrl || apiDelay !== undefined) && (
        <section className="settings__section">
          <h3 className="settings__title">Environment</h3>
          <dl className="settings__env">
            {apiUrl && (
              <>
                <dt>API</dt>
                <dd>{apiUrl}</dd>
              </>
            )}
            {apiDelay !== undefined && (
              <>
                <dt>Simulated delay</dt>
                <dd>{apiDelay} ms</dd>
              </>
            )}
          </dl>
        </section>
      )}
    </div>
  );
}
