interface Size {
  width: number;
  height: number;
}

const EDGE = 8;

/**
 * Vị trí tooltip (T2.5): mặc định dưới anchor, căn trái. Tràn đáy → lật lên trên;
 * tràn phải → dịch sang trái; không bao giờ cách mép < 8px.
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
