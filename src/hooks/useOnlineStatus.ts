import { useSyncExternalStore } from "react";

// subscribe để ngoài component: cùng một hàm giữa các render → React không đăng ký lại.
function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

/** T2.6: đọc navigator.onLine — một "store" bên ngoài React. */
export function useOnlineStatus(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true, // server không biết trạng thái mạng → giả định online
  );
}
