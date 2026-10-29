// LAB 07 — Reset state bằng `key`
// 🐞 Chọn card 1, sửa ô tiêu đề, rồi chọn card 2 → ô vẫn hiện bản nháp của card 1.
//    Bấm "Lưu" lúc đó sẽ ghi đè tiêu đề card 2 bằng nội dung của card 1!
// Giữ nguyên: export `KeyLab`, nút chọn card có tên = title, ô nhập label "Tiêu đề", nút "Lưu".
// KHÔNG dùng useEffect để đồng bộ draft theo card (xem "You Might Not Need an Effect").
import { useState } from "react";

interface LabCard {
  id: string;
  title: string;
}

const INITIAL: LabCard[] = [
  { id: "c1", title: "Sửa lỗi đăng nhập" },
  { id: "c2", title: "Viết tài liệu API" },
];

export function KeyLab() {
  const [cards, setCards] = useState(INITIAL);
  const [selectedId, setSelectedId] = useState("c1");
  const card = cards.find((c) => c.id === selectedId)!;

  return (
    <div className="lab-col">
      <div className="lab-row">
        {cards.map((c) => (
          <button
            key={c.id}
            aria-pressed={c.id === selectedId}
            onClick={() => setSelectedId(c.id)}
          >
            {c.title}
          </button>
        ))}
      </div>
      <CardEditor
        card={card}
        onSave={(title) =>
          setCards((cs) => cs.map((c) => (c.id === card.id ? { ...c, title } : c)))
        }
      />
    </div>
  );
}

function CardEditor({
  card,
  onSave,
}: {
  card: LabCard;
  onSave: (title: string) => void;
}) {
  const [draft, setDraft] = useState(card.title);
  return (
    <div className="lab-row">
      <label>
        Tiêu đề <input value={draft} onChange={(e) => setDraft(e.target.value)} />
      </label>
      <button onClick={() => onSave(draft)}>Lưu</button>
    </div>
  );
}
