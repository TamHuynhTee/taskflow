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

let cachedSize = {
  width: 0,
  height: 0,
};
// Why: getSnapshot returns new object every re-renders → React compare Object.is → useSyncExternalStore thought store changed → infinite render.
export function useWindowSize() {
  return useSyncExternalStore(subscribe, () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    if (newHeight !== cachedSize.height || newWidth !== cachedSize.width)
      cachedSize = { width: newWidth, height: newHeight };

    return cachedSize;
  });
}

export function WindowSize() {
  const { width, height } = useWindowSize();
  return (
    <p className="lab-big">
      {width} × {height}
    </p>
  );
}
