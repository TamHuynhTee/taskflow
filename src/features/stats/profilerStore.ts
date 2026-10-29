import { useSyncExternalStore, type ProfilerOnRenderCallback } from "react";
import type { ProfilerRow } from "../../types";

// Store đơn giản bên ngoài React (T5.2). Mỗi lần ghi tạo MẢNG MỚI để getSnapshot trả
// tham chiếu khác → useSyncExternalStore biết có thay đổi. Trả cùng mảng đã bị sửa
// (push) thì React không thấy khác; trả mảng mới mỗi lần GỌI getSnapshot thì lặp vô hạn.
const MAX_ROWS = 20;
let rows: ProfilerRow[] = [];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export function record(row: ProfilerRow) {
  rows = [row, ...rows].slice(0, MAX_ROWS);
  emit();
}

export function clear() {
  rows = [];
  emit();
}

export function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getSnapshot() {
  return rows;
}

export function useProfilerRows(): ProfilerRow[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/**
 * Callback cho <Profiler onRender>.
 *  - actualDuration: thời gian render cây con TRONG LẦN COMMIT NÀY (memo bỏ qua được bao
 *    nhiêu thì nhỏ đi bấy nhiêu).
 *  - baseDuration: ước tính thời gian render LẠI TOÀN BỘ cây con nếu không có memo nào.
 *  actual << base nghĩa là memo đang có tác dụng.
 *
 * Vì sao không setState trong onRender? onRender chạy sau mỗi commit của cây được đo. Nếu
 * component cha của <Profiler> setState ở đây → cha render lại → Profiler commit → onRender
 * → setState... vòng lặp. Ghi vào store bên ngoài thì chỉ component đọc store render lại.
 * (Store này emit đồng bộ — đừng đặt bảng Profiler bên trong chính cây đang đo.)
 */
export const onRender: ProfilerOnRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  _startTime,
  commitTime,
) => {
  record({ id, phase, actualDuration, baseDuration, commitTime });
};
