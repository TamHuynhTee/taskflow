import { Avatar, Button, PageHeader } from "../../components/ui";
import type { Theme, User } from "../../types";
import "./SettingsView.css";

interface SettingsViewProps {
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  user: User | null;
  onLogout: () => void;
  /** Thông tin môi trường hiển thị cho vui (đọc từ import.meta.env). */
  apiUrl?: string;
  apiDelay?: number;
}

/** Trang /settings (T3.2, lazy-load ở T4.1). */
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
      <PageHeader title="Cài đặt" description="Giao diện và tài khoản" />

      <section className="settings__section">
        <h3 className="settings__title">Giao diện</h3>
        <div className="settings__themes" role="radiogroup" aria-label="Chủ đề">
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
              {t === "light" ? "Sáng" : "Tối"}
            </label>
          ))}
        </div>
      </section>

      <section className="settings__section">
        <h3 className="settings__title">Tài khoản</h3>
        {user ? (
          <div className="settings__account">
            <Avatar user={user} size={40} />
            <div>
              <p className="settings__name">{user.name}</p>
              <p className="settings__muted">ID: {user.id}</p>
            </div>
            <Button variant="danger" size="sm" onClick={onLogout}>
              Đăng xuất
            </Button>
          </div>
        ) : (
          <p className="settings__muted">Chưa đăng nhập.</p>
        )}
      </section>

      {(apiUrl || apiDelay !== undefined) && (
        <section className="settings__section">
          <h3 className="settings__title">Môi trường</h3>
          <dl className="settings__env">
            {apiUrl && (
              <>
                <dt>API</dt>
                <dd>{apiUrl}</dd>
              </>
            )}
            {apiDelay !== undefined && (
              <>
                <dt>Độ trễ giả lập</dt>
                <dd>{apiDelay} ms</dd>
              </>
            )}
          </dl>
        </section>
      )}
    </div>
  );
}
