import { useEffect, useEffectEvent, useState } from "react";

interface FetchState<T> {
  data: T | undefined;
  error: unknown;
  loading: boolean;
}

/**
 * Gọi API trong effect (T2.1 → T2.4). Mỗi lần `deps` đổi: huỷ request cũ bằng AbortController
 * trong cleanup, nên kết quả về muộn của request cũ không bao giờ ghi đè dữ liệu mới (race condition).
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
  // `load` thường là arrow function mới mỗi render — không muốn effect chạy lại vì nó,
  // nên đọc qua Effect Event (luôn thấy bản `load` mới nhất nhưng không phải dependency).
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
    // deps do nơi gọi truyền vào, giống chữ ký của useEffect.
    // oxlint-disable-next-line react/exhaustive-deps
  }, [...deps, reloadKey]);

  return { ...state, reload: () => setReloadKey((k) => k + 1) };
}
