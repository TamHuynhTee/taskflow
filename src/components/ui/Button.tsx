import type { ComponentProps, ReactNode } from "react";
import { Spinner } from "./Spinner";

interface ButtonProps extends ComponentProps<"button"> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  /** Shows a spinner and disables the button. */
  loading?: boolean;
  icon?: ReactNode;
}

export function Button({
  variant = "secondary",
  size = "md",
  loading = false,
  icon,
  className = "",
  type = "button",
  disabled,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`btn btn--${variant} btn--${size} ${className}`}
    >
      {loading ? <Spinner size={14} /> : icon}
      {children}
    </button>
  );
}

interface IconButtonProps extends ComponentProps<"button"> {
  /** Required because the button is icon-only — used for aria-label and the tooltip. */
  label: string;
  variant?: "ghost" | "danger";
}

export function IconButton({
  label,
  variant = "ghost",
  className = "",
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      {...rest}
      type={type}
      aria-label={label}
      title={label}
      className={`icon-btn icon-btn--${variant} ${className}`}
    />
  );
}
