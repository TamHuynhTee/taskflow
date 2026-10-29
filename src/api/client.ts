// Basic fetch helper for json-server. The specific API functions (getBoards, createCard, ...)
// are yours to write in other files on top of request() — see TASKS.md, Level 2.
//
// Simulate a real network (set in .env.local):
//   VITE_API_DELAY=800        -> every request takes 800ms (makes loading/Suspense/pending visible)
//   VITE_API_FAIL_RATE=0.3    -> 30% of write requests (POST/PUT/PATCH/DELETE) fail (to test useOptimistic rollback)

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

const DELAY = Number(import.meta.env.VITE_API_DELAY ?? 500);
const FAIL_RATE = Number(import.meta.env.VITE_API_FAIL_RATE ?? 0);

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function sleep(ms: number, signal?: AbortSignal | null) {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(signal.reason);
    });
  });
}

export async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  await sleep(DELAY, init.signal);

  const method = (init.method ?? "GET").toUpperCase();
  if (method !== "GET" && Math.random() < FAIL_RATE) {
    throw new ApiError(500, `Simulated failure on ${method} ${path}`);
  }

  const res = await fetch(API_URL + path, {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
  });

  if (!res.ok) {
    throw new ApiError(res.status, `${method} ${path} failed: ${res.status}`);
  }

  // DELETE may return an empty body
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
