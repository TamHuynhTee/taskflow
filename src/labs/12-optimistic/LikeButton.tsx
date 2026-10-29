// LAB 12 — useOptimistic  (bài IMPLEMENT)
// Hiện tại: bấm ❤️ phải chờ server (1.5s) số mới tăng — cảm giác app "đơ".
// Mục tiêu:
//   1. Bấm → số tăng NGAY (+1), nút có aria-busy="true" trong lúc chờ.
//   2. Server OK → hiện số server trả về.
//   3. Server lỗi → số tự quay về giá trị cũ + hiện role="alert" "Không gửi được".
// Dùng useOptimistic + startTransition (hoặc <form action>). Không tự viết state "pendingLikes".
// Giữ nguyên: export `LikeButton` (props `initialLikes`, `sendLike`), nút có tên "❤️ <số>".
import { useState } from "react";

let demoCount = 0;
async function demoSendLike(current: number) {
  await new Promise((r) => setTimeout(r, 1500));
  if (++demoCount % 3 === 0) throw new Error("500");
  return current + 1;
}

export function LikeButton({
  initialLikes = 10,
  sendLike = demoSendLike,
}: {
  initialLikes?: number;
  /** Nhận số like hiện tại, trả về số like mới từ server. */
  sendLike?: (current: number) => Promise<number>;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [error, setError] = useState("");

  async function handleClick() {
    setError("");
    try {
      setLikes(await sendLike(likes));
    } catch {
      setError("Không gửi được");
    }
  }

  return (
    <div className="lab-row">
      <button onClick={handleClick}>❤️ {likes}</button>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
