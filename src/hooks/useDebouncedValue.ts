import { useEffect, useState } from "react";

/** Returns `value` only after it has stopped changing for `delayMs` ms (T2.4). */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs);
    // Value changed before the timer fired → cleanup cancels the old timer and sets a new one.
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debounced;
}
