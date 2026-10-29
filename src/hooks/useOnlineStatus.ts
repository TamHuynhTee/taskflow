import { useSyncExternalStore } from "react";

// subscribe lives outside the component: the same function across renders → React doesn't resubscribe.
function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

/** T2.6: reads navigator.onLine — a "store" outside React. */
export function useOnlineStatus(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true, // the server doesn't know the network status → assume online
  );
}
