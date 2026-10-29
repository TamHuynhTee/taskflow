import { useEffect, useState } from "react";

function read<T>(key: string, initial: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? initial : (JSON.parse(raw) as T);
  } catch {
    return initial; // broken JSON or localStorage is blocked
  }
}

/** useState persisted to localStorage (T2.4). */
export function useLocalStorage<T>(
  key: string,
  initial: T,
): [T, (next: T | ((prev: T) => T)) => void] {
  // Lazy init: the function only runs on the first render, so localStorage isn't read every render.
  const [value, setValue] = useState<T>(() => read(key, initial));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Quota exceeded / private mode: ignore it, the in-memory state is still correct.
    }
  }, [key, value]);

  return [value, setValue];
}
