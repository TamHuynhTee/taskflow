import { useImperativeHandle, useRef, useState, type Ref } from "react";
import { ConfirmDialogView } from "./ui";

export interface ConfirmDialogHandle {
  open(
    message: string,
    options?: { confirmText?: string; danger?: boolean },
  ): Promise<boolean>;
}

interface DialogState {
  open: boolean;
  message: string;
  options: { confirmText?: string; danger?: boolean };
}

/**
 * Hộp xác nhận điều khiển theo kiểu mệnh lệnh (T3.5):
 *   if (await confirmRef.current?.open("Xoá?")) ...
 * React 19: `ref` là prop thường, không cần forwardRef. useImperativeHandle quyết định
 * cha nhận được gì qua ref — ở đây chỉ hàm open(), không lộ DOM hay state bên trong.
 */
export function ConfirmDialog({ ref }: { ref: Ref<ConfirmDialogHandle> }) {
  const [state, setState] = useState<DialogState>({
    open: false,
    message: "",
    options: {},
  });
  // resolve của Promise đang chờ — không cần render lại khi đổi nên để trong ref.
  const resolveRef = useRef<((ok: boolean) => void) | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      open(message, options = {}) {
        resolveRef.current?.(false); // mở chồng lên → huỷ lời hỏi trước
        setState({ open: true, message, options });
        return new Promise<boolean>((resolve) => {
          resolveRef.current = resolve;
        });
      },
    }),
    [],
  );

  function finish(ok: boolean) {
    resolveRef.current?.(ok);
    resolveRef.current = null;
    setState((s) => ({ ...s, open: false }));
  }

  return (
    <ConfirmDialogView
      open={state.open}
      message={state.message}
      confirmText={state.options.confirmText}
      danger={state.options.danger}
      onConfirm={() => finish(true)}
      onCancel={() => finish(false)} // Esc / backdrop / nút Huỷ đều = huỷ
    />
  );
}
