import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  fallback: (error: unknown, reset: () => void) => ReactNode;
  /** Đổi giá trị bất kỳ phần tử nào → tự reset (vd. đổi board). */
  resetKeys?: unknown[];
  children: ReactNode;
}

interface ErrorBoundaryState {
  // Bọc trong object để phân biệt "chưa lỗi" với trường hợp code `throw undefined`.
  caught: { error: unknown } | null;
}

/**
 * T3.7 — vẫn phải viết bằng class: chưa có hook tương đương getDerivedStateFromError.
 *
 * Boundary CHỈ bắt lỗi xảy ra khi React render / chạy lifecycle / effect của cây con.
 * KHÔNG bắt: lỗi trong event handler (onClick), trong code async (setTimeout, promise
 * sau await), và lỗi của chính boundary. Những lỗi đó tự try/catch rồi hiện toast/state.
 */
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { caught: null };

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { caught: { error } };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  componentDidUpdate(prev: ErrorBoundaryProps) {
    const a = prev.resetKeys ?? [];
    const b = this.props.resetKeys ?? [];
    const changed =
      a.length !== b.length || a.some((v, i) => !Object.is(v, b[i]));
    if (this.state.caught && changed) this.reset();
  }

  reset = () => this.setState({ caught: null });

  render() {
    if (this.state.caught) {
      return this.props.fallback(this.state.caught.error, this.reset);
    }
    return this.props.children;
  }
}
