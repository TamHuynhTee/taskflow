import { useEffect, useEffectEvent } from "react";

function isTyping(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
  );
}

/** Page-wide keyboard shortcut, ignored while typing in an input (T2.4). */
export function useKeyboardShortcut(
  key: string,
  handler: (e: KeyboardEvent) => void,
  options: { enabled?: boolean } = {},
) {
  const { enabled = true } = options;
  const onKey = useEffectEvent(handler);

  useEffect(() => {
    if (!enabled) return;
    function listener(e: KeyboardEvent) {
      if (e.key !== key || e.ctrlKey || e.metaKey || e.altKey) return;
      if (isTyping(e.target)) return;
      onKey(e);
    }
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [key, enabled]);
}
