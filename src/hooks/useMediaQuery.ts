import { useCallback, useSyncExternalStore } from "react";

/** T2.6: true khi media query khớp, tự cập nhật khi đổi kích thước cửa sổ. */
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
    () => window.matchMedia(query).matches, // trả boolean (giá trị nguyên thuỷ) → so sánh ổn định
    () => false,
  );
}
