// LAB 06 — useSyncExternalStore & getSnapshot
// 🐞 Mở trang demo: lab crash ("Maximum update depth exceeded") + console báo
//    "The result of getSnapshot should be cached". Không có ErrorBoundary thì cả app trắng trang.
// Giữ nguyên: export `useWindowSize` (trả { width, height }) và `WindowSize` (hiện "<w> × <h>").
// Bonus (không có test): thêm getServerSnapshot để hook chạy được khi SSR.
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
