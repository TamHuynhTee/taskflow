// LAB 06 — useSyncExternalStore & getSnapshot
// 🐞 Open the demo page: the lab crashes ("Maximum update depth exceeded") + the console says
//    "The result of getSnapshot should be cached". Without an ErrorBoundary the whole app goes blank.
// Keep as is: the `useWindowSize` export (returns { width, height }) and `WindowSize` (shows "<w> × <h>").
// Bonus (no test): add getServerSnapshot so the hook works during SSR.
import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

export function useWindowSize() {
  return useSyncExternalStore(subscribe, () => ({
    width: window.innerWidth,
    height: window.innerHeight,
  }));
}

export function WindowSize() {
  const { width, height } = useWindowSize();
  return (
    <p className="lab-big">
      {width} × {height}
    </p>
  );
}
