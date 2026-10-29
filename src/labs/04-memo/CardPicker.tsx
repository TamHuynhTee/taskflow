// LAB 04 — memo bị vô hiệu
// 🐞 CardRow đã bọc memo, nhưng bấm "Làm mới" (state không liên quan) vẫn render lại MỌI dòng;
//    chọn 1 card cũng render lại mọi dòng. Bật "Highlight updates" trong React DevTools để thấy.
// Mục tiêu: "Làm mới" → 0 dòng render lại; chọn card X → chỉ những dòng đổi trạng thái chọn render lại.
// Giữ nguyên: export `CardPicker`, `renderLog` (mỗi lần CardRow render push title vào), nút "Làm mới",
//             mỗi dòng là button có tên = title, dòng đang chọn có aria-pressed="true".
// Được phép sửa CardRow và props của nó. KHÔNG bật React Compiler.
import { memo, useState, type CSSProperties } from "react";

export const renderLog: string[] = [];

interface CardRowProps {
  title: string;
  selected: boolean;
  onSelect: () => void;
  style: CSSProperties;
}

const CardRow = memo(function CardRow({
  title,
  selected,
  onSelect,
  style,
}: CardRowProps) {
  renderLog.push(title);
  return (
    <button aria-pressed={selected} style={style} onClick={onSelect}>
      {title}
    </button>
  );
});

export function CardPicker({
  cards = ["Thiết kế logo", "Viết API", "Sửa lỗi Safari", "Deploy"],
}: {
  cards?: string[];
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [refreshCount, setRefreshCount] = useState(0);

  return (
    <div className="lab-col">
      <button onClick={() => setRefreshCount((n) => n + 1)}>Làm mới</button>
      <small>Đã làm mới {refreshCount} lần</small>
      {cards.map((title) => (
        <CardRow
          key={title}
          title={title}
          selected={title === selected}
          onSelect={() => setSelected(title)}
          style={{ padding: 8, textAlign: "left" }}
        />
      ))}
    </div>
  );
}
