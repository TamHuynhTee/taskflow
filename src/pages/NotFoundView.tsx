import type { ReactNode } from "react";
import { EmptyState } from "../components/ui";

/** 404 page (T3.1). Pass <Link to="/boards">Back to home</Link> as `action`. */
export function NotFoundView({ action }: { action?: ReactNode }) {
  return (
    <EmptyState
      icon="🧭"
      title="Page not found"
      description="The link doesn't exist or the board was deleted."
      action={action}
    />
  );
}
