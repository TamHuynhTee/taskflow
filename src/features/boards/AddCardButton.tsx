import type { ComponentProps } from "react";
import "./boardWidgets.css";

/** "+ Add card" button at the bottom of a column (via BoardView's renderColumnFooter). */
export function AddCardButton({
  children = "+ Add card",
  ...rest
}: ComponentProps<"button">) {
  return (
    <button type="button" className="add-card-btn" {...rest}>
      {children}
    </button>
  );
}
