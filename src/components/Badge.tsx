import type { ReactNode } from "react";
import "./Badge.css";

export type BadgeTone =
  "neutral" | "red" | "orange" | "yellow" | "green" | "blue" | "purple";

interface BadgeProps {
  tone?: BadgeTone;
  title?: string;
  // `children` là bất cứ thứ gì đặt giữa <Badge>...</Badge>: chữ, số, icon, JSX khác.
  children: ReactNode;
}

export function Badge({ tone = "neutral", title, children }: BadgeProps) {
  return (
    <span className={`badge badge--${tone}`} title={title}>
      {children}
    </span>
  );
}
