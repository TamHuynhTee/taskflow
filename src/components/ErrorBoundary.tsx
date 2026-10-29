import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  fallback: (error: unknown, reset: () => void) => ReactNode;
  /** Changing any element resets the boundary automatically (e.g. switching boards). */
  resetKeys?: unknown[];
  children: ReactNode;
}

interface ErrorBoundaryState {
  // Wrapped in an object to tell "no error" apart from code that does `throw undefined`.
  caught: { error: unknown } | null;
}

/**
 * T3.7 — still has to be a class: there is no hook equivalent of getDerivedStateFromError yet.
 *
 * A boundary ONLY catches errors thrown while React renders / runs lifecycles / effects of its subtree.
 * It does NOT catch: errors in event handlers (onClick), in async code (setTimeout, a promise
 * after await), or in the boundary itself. Handle those with try/catch and show a toast/state.
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
