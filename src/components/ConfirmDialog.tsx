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
 * Confirmation dialog driven imperatively (T3.5):
 *   if (await confirmRef.current?.open("Delete?")) ...
 * React 19: `ref` is a regular prop, no forwardRef needed. useImperativeHandle decides what
 * the parent gets through the ref — here only open(), without exposing the DOM or internal state.
 */
export function ConfirmDialog({ ref }: { ref: Ref<ConfirmDialogHandle> }) {
  const [state, setState] = useState<DialogState>({
    open: false,
    message: "",
    options: {},
  });
  // resolve of the pending Promise — changing it needn't re-render, so it lives in a ref.
  const resolveRef = useRef<((ok: boolean) => void) | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      open(message, options = {}) {
        resolveRef.current?.(false); // opened on top of another → cancel the previous question
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
      onCancel={() => finish(false)} // Esc / backdrop / Cancel button all mean cancel
    />
  );
}
