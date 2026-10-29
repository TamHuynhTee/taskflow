interface Size {
  width: number;
  height: number;
}

const EDGE = 8;

/**
 * Tooltip position (T2.5): below the anchor by default, left-aligned. Overflows the bottom → flips above;
 * overflows the right → shifts left; never closer than 8px to an edge.
 */
export function computeTooltipPosition(
  anchor: Pick<DOMRect, "top" | "bottom" | "left">,
  size: Size,
  viewport: Size,
  gap = 8,
): { top: number; left: number } {
  let top = anchor.bottom + gap;
  if (top + size.height > viewport.height - EDGE) {
    top = anchor.top - gap - size.height;
  }
  let left = anchor.left;
  if (left + size.width > viewport.width - EDGE) {
    left = viewport.width - EDGE - size.width;
  }
  return { top: Math.max(EDGE, top), left: Math.max(EDGE, left) };
}
