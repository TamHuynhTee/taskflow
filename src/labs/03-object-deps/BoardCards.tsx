// LAB 03 — Object trong dependency array
// 🐞 Mở tab Network/console: `load` bị gọi liên tục không dừng (vòng lặp render ↔ effect).
// Giữ nguyên: export `BoardCards`, props `boardId` + `load`. Mỗi boardId chỉ được gọi load 1 lần.
// Không được "chữa" bằng deps rỗng [] — đổi boardId vẫn phải tải lại.
import { useEffect, useState } from "react";

export interface LoadOptions {
  boardId: string;
  includeArchived: boolean;
}

let demoCalls = 0;
async function demoLoad(options: LoadOptions) {
  demoCalls++;
  console.log(`[lab03] load lần ${demoCalls}`, options);
  await new Promise((r) => setTimeout(r, 300));
  return [`Card A của ${options.boardId}`, `Card B của ${options.boardId}`];
}

export function BoardCards({
  boardId,
  load = demoLoad,
}: {
  boardId: string;
  load?: (options: LoadOptions) => Promise<string[]>;
}) {
  const [cards, setCards] = useState<string[]>([]);

  const options = { boardId, includeArchived: false };

  useEffect(() => {
    load(options).then(setCards);
  }, [options, load]);

  return (
    <ul>
      {cards.map((c) => (
        <li key={c}>{c}</li>
      ))}
    </ul>
  );
}
