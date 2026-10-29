import type { ComponentProps } from "react";
import "./boardWidgets.css";

/** Nút "+ Thêm card" đặt cuối cột (qua renderColumnFooter của BoardView). */
export function AddCardButton({
  children = "+ Thêm card",
  ...rest
}: ComponentProps<"button">) {
  return (
    <button type="button" className="add-card-btn" {...rest}>
      {children}
    </button>
  );
}
