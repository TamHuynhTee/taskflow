// Phần giao diện của Modal. Các hành vi sau là bài tập, CHƯA làm:
//   T3.4 — render vào document.body bằng createPortal; đóng khi bấm Esc; đóng khi click
//          ra backdrop (nhưng không đóng khi click bên trong panel); khoá scroll body khi mở.
//   T6.3 — focus trap (Tab không thoát ra ngoài modal), trả focus về phần tử cũ khi đóng.
import type { ReactNode } from "react";
import { Button, IconButton } from "./Button";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}

export function Modal({
  open,
  title,
  onClose,
  children,
  footer,
  size = "md",
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div
        className={`modal modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <header className="modal__header">
          <h2 className="modal__title" id="modal-title">
            {title}
          </h2>
          <IconButton label="Đóng" onClick={onClose}>
            ✕
          </IconButton>
        </header>
        <div className="modal__body">{children}</div>
        {footer && <footer className="modal__footer">{footer}</footer>}
      </div>
    </div>
  );
}

interface ConfirmDialogViewProps {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Giao diện hộp xác nhận. Ở T3.5 bạn viết component `ConfirmDialog` bọc view này,
 * tự quản lý state open/message và expose `open(message): Promise<boolean>` qua useImperativeHandle.
 */
export function ConfirmDialogView({
  open,
  title = "Xác nhận",
  message,
  confirmText = "Đồng ý",
  cancelText = "Huỷ",
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogViewProps) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      size="sm"
      footer={
        <>
          <Button onClick={onCancel}>{cancelText}</Button>
          <Button variant={danger ? "danger" : "primary"} onClick={onConfirm}>
            {confirmText}
          </Button>
        </>
      }
    >
      <p className="confirm__message">{message}</p>
    </Modal>
  );
}
