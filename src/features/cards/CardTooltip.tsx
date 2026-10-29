import { useLayoutEffect, useRef, useState } from "react";
import { TooltipBox } from "../../components/ui";
import { computeTooltipPosition } from "./tooltipPosition";

/**
 * T2.5 — measure the tooltip's real size first, then position it.
 *
 * useEffect runs AFTER the browser has painted → the user sees the tooltip at (0,0) for one frame
 * before it "jumps" to the right place (a flicker). useLayoutEffect runs after React updates the DOM but
 * BEFORE paint; a setState inside it re-renders synchronously → only the correct position gets painted.
 * Change useLayoutEffect below to useEffect (and set VITE_API_DELAY low) to see the flicker.
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
