import { useEffect, useEffectEvent, useState } from "react";

interface FetchState<T> {
  data: T | undefined;
  error: unknown;
  loading: boolean;
}

/**
 * Calls an API in an effect (T2.1 → T2.4). Whenever `deps` change: the old request is aborted with an AbortController
 * in the cleanup, so a late result from an old request never overwrites newer data (race condition).
 */
export function useFetch<T>(
  load: (signal: AbortSignal) => Promise<T>,
  deps: unknown[],
): FetchState<T> & { reload: () => void } {
  const [state, setState] = useState<FetchState<T>>({
    data: undefined,
    error: null,
    loading: true,
  });
  const [reloadKey, setReloadKey] = useState(0);
  // `load` is usually a new arrow function every render — we don't want the effect to re-run because of it,
  // so read it through an Effect Event (always sees the latest `load` but isn't a dependency).
  const runLoad = useEffectEvent(load);

  useEffect(() => {
    const controller = new AbortController();
    setState((s) => ({ ...s, loading: true, error: null }));
    runLoad(controller.signal).then(
      (data) => {
        if (!controller.signal.aborted) {
          setState({ data, error: null, loading: false });
        }
      },
      (error: unknown) => {
        if (!controller.signal.aborted) {
          setState({ data: undefined, error, loading: false });
        }
      },
    );
    return () => controller.abort();
    // deps are passed in by the caller, like useEffect's signature.
    // oxlint-disable-next-line react/exhaustive-deps
  }, [...deps, reloadKey]);

  return { ...state, reload: () => setReloadKey((k) => k + 1) };
}
