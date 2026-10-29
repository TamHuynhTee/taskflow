import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "./ui";

/**
 * Submit button that knows when its parent form is submitting (T4.4).
 * useFormStatus reads the status of the NEAREST PARENT <form> — like a context provided by <form>.
 * Calling it in the component that renders the <form> always gives pending=false, because that form
 * is a child, not a parent, of the component calling the hook.
 */
export function SubmitButton({
  children,
  pendingText = "Saving…",
}: {
  children: ReactNode;
  pendingText?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" loading={pending}>
      {pending ? pendingText : children}
    </Button>
  );
}
