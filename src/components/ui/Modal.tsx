// Modal: renders through a portal into document.body (T3.4) + manages focus (T6.3).
//
// EXPERIMENT (T3.4): wrap <Modal> in <div onClick={() => console.log("bubble")}>. Clicking inside
// the modal still logs even though its DOM lives in <body>: React events bubble along the REACT TREE
// (parent/child in JSX), not the DOM tree. A portal only moves where the DOM is mounted, not the parent/child relationship.
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

// Stack of open modals: only the top one reacts to Esc/Tab (two nested modals).
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
  // onClose is usually a new arrow function every render; reading it through an Effect Event means
  // the effect doesn't remove/re-add the listener (and restore focus wrongly) every time the parent renders.
  const close = useEffectEvent(onClose);

  useEffect(() => {
    if (!open) return;
    const token = Symbol("modal");
    modalStack.push(token);
    const isTop = () => modalStack.at(-1) === token;

    const opener = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // A child's effects run BEFORE the parent's: if the child already focused something (e.g. the title
    // field in CreateCardForm), leave it alone instead of stealing focus.
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
      // Focus trap: Tab on the last element → back to the first; Shift+Tab on the first → to the last.
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
      // Return focus to the button that opened the modal (if it's still in the page).
      if (opener?.isConnected) opener.focus();
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="modal-backdrop"
      onClick={(e) => {
        // Only close on a click on the backdrop itself — clicks inside the panel target a child element.
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
          <IconButton label="Close" onClick={onClose}>
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
 * Confirmation dialog view. `ConfirmDialog` (components/ConfirmDialog.tsx) wraps this view and
 * expose `open(message): Promise<boolean>` qua useImperativeHandle (T3.5).
 */
export function ConfirmDialogView({
  open,
  title = "Confirm",
  message,
  confirmText = "OK",
  cancelText = "Cancel",
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
