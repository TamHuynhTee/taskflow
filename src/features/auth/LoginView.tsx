import { Avatar, Spinner } from "../../components/ui";
import type { User } from "../../types";
import "./LoginView.css";

interface LoginViewProps {
  users: User[];
  onSelect: (user: User) => void;
  /** Loading the user list from the API. */
  loading?: boolean;
}

/** Fake sign-in screen: pick a user (T3.2). No password. */
export function LoginView({
  users,
  onSelect,
  loading = false,
}: LoginViewProps) {
  return (
    <div className="login">
      <div className="login__panel">
        <h1 className="login__logo">TaskFlow</h1>
        <p className="login__subtitle">Choose an account to continue</p>
        {loading ? (
          <div className="login__loading">
            <Spinner />
          </div>
        ) : (
          <ul className="login__users">
            {users.map((u) => (
              <li key={u.id}>
                <button
                  type="button"
                  className="login__user"
                  onClick={() => onSelect(u)}
                >
                  <Avatar user={u} size={36} />
                  <span>{u.name}</span>
                  <span className="login__arrow" aria-hidden>
                    →
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
