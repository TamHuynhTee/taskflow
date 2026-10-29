import { useEffect, useState } from "react";

function read<T>(key: string, initial: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? initial : (JSON.parse(raw) as T);
  } catch {
    return initial; // JSON hỏng hoặc localStorage bị chặn
  }
}

/** useState có lưu vào localStorage (T2.4). */
export function useLocalStorage<T>(
  key: string,
  initial: T,
): [T, (next: T | ((prev: T) => T)) => void] {
  // Lazy init: hàm chỉ chạy ở lần render đầu, không đọc localStorage mỗi render.
  const [value, setValue] = useState<T>(() => read(key, initial));

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Hết dung lượng / chế độ ẩn danh: bỏ qua, state trong bộ nhớ vẫn đúng.
    }
  }, [key, value]);

  return [value, setValue];
}
