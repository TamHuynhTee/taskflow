// LAB 02 — Race condition khi fetch trong effect
// 🐞 Gõ nhanh "lo": request "l" (chậm) về SAU request "lo" (nhanh) và ghi đè kết quả →
//    ô đang là "lo" nhưng danh sách lại là kết quả của "l".
// Giữ nguyên: export `CardSearch`, prop `search`, ô nhập có label "Tìm card", kết quả là <li>.
import { useEffect, useState } from "react";
import { delay } from "../testUtils";

const TITLES = ["layout trang chủ", "login bằng Google", "logo mới", "lỗi thanh toán", "landing page"];

/** API giả: từ khoá càng NGẮN trả về càng CHẬM — để dễ thấy bug trên trang demo. */
function fakeSearch(q: string) {
  const found = TITLES.filter((t) => t.includes(q));
  return delay(1500 / q.length, found);
}

export function CardSearch({
  search = fakeSearch,
}: {
  search?: (query: string) => Promise<string[]>;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    search(query).then((found) => setResults(found));
  }, [query, search]);

  return (
    <div>
      <input
        aria-label="Tìm card"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Gõ nhanh: lo"
      />
      <ul>
        {results.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </div>
  );
}
