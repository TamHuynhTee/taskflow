import type { ComponentProps } from "react";
import "./boardWidgets.css";
import { Spinner } from "../../components/ui";

interface SearchBoxProps extends Omit<ComponentProps<"input">, "type"> {
  /** Shows a ✕ button — called when it's clicked. */
  onClear?: () => void;
  /** Shows a small spinner on the right, e.g. while results are being recomputed (T4.7). */
  busy?: boolean;
}

/**
 * Search box. All remaining props (value, onChange, defaultValue, ref...) go straight down to the <input>,
 * so it works both controlled (T1.3) and uncontrolled + ref (T2.3 debounce).
 */
export function SearchBox({
  onClear,
  busy = false,
  className = "",
  placeholder = "Search cards…",
  ...rest
}: SearchBoxProps) {
  return (
    <div className={`search-box ${className}`}>
      <span className="search-box__icon" aria-hidden>
        🔍
      </span>
      <input
        {...rest}
        type="search"
        placeholder={placeholder}
        aria-label={rest["aria-label"] ?? "Search cards"}
      />
      {busy && <Spinner size={14} label="Filtering" />}
      {onClear && (
        <button
          type="button"
          className="search-box__clear"
          aria-label="Clear search"
          onClick={onClear}
        >
          ✕
        </button>
      )}
    </div>
  );
}
