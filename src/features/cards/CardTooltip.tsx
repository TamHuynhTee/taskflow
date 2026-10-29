import { useLayoutEffect, useRef, useState } from "react";
import { TooltipBox } from "../../components/ui";
import { computeTooltipPosition } from "./tooltipPosition";

/**
 * T2.5 — đo kích thước thật của tooltip rồi mới đặt vị trí.
 *
 * useEffect chạy SAU khi trình duyệt đã vẽ → người dùng thấy tooltip ở (0,0) một khung hình
 * rồi mới "nhảy" về đúng chỗ (nháy). useLayoutEffect chạy sau khi React cập nhật DOM nhưng
 * TRƯỚC khi vẽ; setState trong đó được render lại đồng bộ → chỉ vị trí đúng được vẽ ra.
 * Đổi chữ useLayoutEffect bên dưới thành useEffect (và đặt VITE_API_DELAY thấp) để thấy nháy.
 */
export function CardTooltip({ anchor, text }: { anchor: DOMRect; text: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    const { width, height } = ref.current!.getBoundingClientRect();
    setPos(
      computeTooltipPosition(
        anchor,
        { width, height },
        { width: window.innerWidth, height: window.innerHeight },
      ),
    );
  }, [anchor]);

  return (
    <TooltipBox ref={ref} style={pos}>
      {text}
    </TooltipBox>
  );
}
