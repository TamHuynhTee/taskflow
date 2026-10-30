// LAB 04 — memo defeated
// 🐞 CardRow is wrapped in memo, yet clicking "Refresh" (unrelated state) still re-renders EVERY row;
//    selecting 1 card also re-renders every row. Turn on "Highlight updates" in React DevTools to see it.
// Goal: "Refresh" → 0 rows re-render; selecting card X → only the rows whose selected state changed re-render.
// Keep as is: the `CardPicker` export, `renderLog` (every CardRow render pushes its title), the "Refresh" button,
//             each row is a button named after its title, the selected row has aria-pressed="true".
// You may change CardRow and its props. DON'T turn on the React Compiler.
import { memo, useState, type CSSProperties } from "react";

export const renderLog: string[] = [];

const ROW_STYLE: CSSProperties = { padding: 8, textAlign: "left" };

interface CardRowProps {
  title: string;
  selected: boolean;
  onSelect: (title: string) => void;
  style: CSSProperties;
}

const CardRow = memo(function CardRow({
  title,
  selected,
  onSelect,
  style,
}: CardRowProps) {
  renderLog.push(title);
  const handleSelect = () => {
    onSelect(title);
  };
  return (
    <button aria-pressed={selected} style={style} onClick={handleSelect}>
      {title}
    </button>
  );
});

export function CardPicker({
  cards = ["Design logo", "Write API", "Fix Safari bug", "Deploy"],
}: {
  cards?: string[];
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  return (
    <div className="lab-col">
      <button onClick={() => setRefreshCount((n) => n + 1)}>Refresh</button>
      <small>Refreshed {refreshCount} times</small>
      {cards.map((title) => (
        <CardRow
          key={title}
          title={title}
          selected={title === selected}
          // Pass setSelected directly as props since itself always keeps its reference
          onSelect={setSelected}
          // Avoid passing literal object as props because it creates new reference
          style={ROW_STYLE}
        />
      ))}
    </div>
  );
}
