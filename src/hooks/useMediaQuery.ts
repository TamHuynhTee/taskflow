import { useCallback, useSyncExternalStore } from "react";

/** T2.6: true when the media query matches, updates automatically when the window resizes. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches, // returns a boolean (a primitive) → stable comparison
    () => false,
  );
}
