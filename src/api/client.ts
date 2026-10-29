// Hàm fetch cơ bản tới json-server. Các hàm API cụ thể (getBoards, createCard, ...)
// bạn tự viết trong file khác dựa trên request() — xem TASKS.md, Level 2.
//
// Giả lập mạng thật (chỉnh trong file .env.local):
//   VITE_API_DELAY=800        -> mỗi request chậm 800ms (thấy rõ loading/Suspense/pending)
//   VITE_API_FAIL_RATE=0.3    -> 30% request ghi (POST/PUT/PATCH/DELETE) bị lỗi (test rollback useOptimistic)

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
    throw new ApiError(500, `Lỗi giả lập khi ${method} ${path}`);
  }

  const res = await fetch(API_URL + path, {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
  });

  if (!res.ok) {
    throw new ApiError(res.status, `${method} ${path} thất bại: ${res.status}`);
  }

  // DELETE có thể trả body rỗng
  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}
