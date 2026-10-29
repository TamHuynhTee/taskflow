// Modal: render qua portal vào document.body (T3.4) + quản lý focus (T6.3).
//
// THÍ NGHIỆM (T3.4): bọc <Modal> trong <div onClick={() => console.log("bubble")}>. Click bên trong
// modal vẫn log dù DOM của modal nằm ở <body>: sự kiện React nổi bọt theo CÂY REACT (cha/con
// trong JSX), không theo cây DOM. Portal chỉ đổi chỗ gắn DOM, không đổi quan hệ cha/con.
import {
  useEffect,
  useEffectEvent,
  useId,
  useRef,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Button, IconButton } from "./Button";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}

// Ngăn xếp modal đang mở: chỉ modal trên cùng phản ứng với Esc/Tab (2 modal lồng nhau).
const modalStack: symbol[] = [];

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function focusablesIn(el: HTMLElement) {
  return [...el.querySelectorAll<HTMLElement>(FOCUSABLE)];
}

export function Modal({
  open,
  title,
  onClose,
  children,
  footer,
  size = "md",
}: ModalProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  // onClose thường là arrow function mới mỗi render; đọc qua Effect Event để effect
  // không phải gỡ/gắn lại listener (và khôi phục focus nhầm) mỗi lần cha render.
  const close = useEffectEvent(onClose);

  useEffect(() => {
    if (!open) return;
    const token = Symbol("modal");
    modalStack.push(token);
    const isTop = () => modalStack.at(-1) === token;

    const opener = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Effect của con chạy TRƯỚC effect của cha: nếu con đã tự focus (vd. ô tiêu đề ở
    // CreateCardForm) thì giữ nguyên, không cướp focus.
    const panel = panelRef.current!;
    if (!panel.contains(document.activeElement)) {
      (focusablesIn(panel)[0] ?? panel).focus();
    }

    function onKeyDown(e: KeyboardEvent) {
      if (!isTop()) return;
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      // Focus trap: Tab ở phần tử cuối → về đầu; Shift+Tab ở đầu → về cuối.
      const items = focusablesIn(panel);
      if (items.length === 0) return e.preventDefault();
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || !panel.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !panel.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      modalStack.splice(modalStack.indexOf(token), 1);
      document.body.style.overflow = prevOverflow;
      // Trả focus về nút đã mở modal (nếu nó vẫn còn trong trang).
      if (opener?.isConnected) opener.focus();
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="modal-backdrop"
      onClick={(e) => {
        // Chỉ đóng khi click đúng backdrop — click trong panel có target là phần tử con.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className={`modal modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <header className="modal__header">
          <h2 className="modal__title" id={titleId}>
            {title}
          </h2>
          <IconButton label="Đóng" onClick={onClose}>
            ✕
          </IconButton>
        </header>
        <div className="modal__body">{children}</div>
        {footer && <footer className="modal__footer">{footer}</footer>}
      </div>
    </div>,
    document.body,
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
 * Giao diện hộp xác nhận. `ConfirmDialog` (components/ConfirmDialog.tsx) bọc view này và
 * expose `open(message): Promise<boolean>` qua useImperativeHandle (T3.5).
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
