import { useEffect, useState } from "react";

/** Trả về `value` chỉ sau khi nó ngừng thay đổi `delayMs` ms (T2.4). */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    // Giá trị đổi trước khi hết giờ → cleanup huỷ timer cũ, đặt timer mới.
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
