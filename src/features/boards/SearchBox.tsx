import type { ComponentProps } from "react";
import "./boardWidgets.css";
import { Spinner } from "../../components/ui";

interface SearchBoxProps extends Omit<ComponentProps<"input">, "type"> {
  /** Hiện nút ✕ — gọi khi bấm. */
  onClear?: () => void;
  /** Hiện spinner nhỏ bên phải, vd. khi kết quả đang được tính lại (T4.7). */
  busy?: boolean;
}

/**
 * Ô tìm kiếm. Mọi props còn lại (value, onChange, defaultValue, ref...) chuyển thẳng xuống <input>,
 * nên dùng được cả controlled (T1.3) lẫn uncontrolled + ref (T2.3 debounce).
 */
export function SearchBox({
  onClear,
  busy = false,
  className = "",
  placeholder = "Tìm card…",
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
        aria-label={rest["aria-label"] ?? "Tìm card"}
      />
      {busy && <Spinner size={14} label="Đang lọc" />}
      {onClear && (
        <button
          type="button"
          className="search-box__clear"
          aria-label="Xoá tìm kiếm"
          onClick={onClear}
        >
          ✕
        </button>
      )}
    </div>
  );
}
