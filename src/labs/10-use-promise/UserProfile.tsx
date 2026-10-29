// LAB 10 — use(promise) cần promise ổn định
// 🐞 Trang demo kẹt mãi ở "Đang tải…", console/Network thấy fetchUser bị gọi liên tục.
// Mục tiêu: mỗi userId chỉ fetch 1 lần; quay lại user đã xem → hiện ngay, không "Đang tải…".
// Giữ nguyên: export `UseLab` (prop `fetchUser`), nút "An" / "Bình", fallback "Đang tải…".
import { Suspense, use, useState } from "react";
import { delay } from "../testUtils";

export interface LabUser {
  id: string;
  name: string;
}

const USERS: Record<string, LabUser> = {
  u1: { id: "u1", name: "An" },
  u2: { id: "u2", name: "Bình" },
};

let demoCalls = 0;
function demoFetchUser(id: string) {
  console.log(`[lab10] fetchUser(${id}) lần ${++demoCalls}`);
  return delay(500, USERS[id]);
}

function UserProfile({
  userId,
  fetchUser,
}: {
  userId: string;
  fetchUser: (id: string) => Promise<LabUser>;
}) {
  const user = use(fetchUser(userId));
  return <p className="lab-big">👤 {user.name}</p>;
}

export function UseLab({
  fetchUser = demoFetchUser,
}: {
  fetchUser?: (id: string) => Promise<LabUser>;
}) {
  const [userId, setUserId] = useState("u1");
  return (
    <div className="lab-col">
      <div className="lab-row">
        <button onClick={() => setUserId("u1")}>An</button>
        <button onClick={() => setUserId("u2")}>Bình</button>
      </div>
      <Suspense fallback={<p>Đang tải…</p>}>
        <UserProfile userId={userId} fetchUser={fetchUser} />
      </Suspense>
    </div>
  );
}
