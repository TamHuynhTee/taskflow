// LAB 10 — use(promise) needs a stable promise
// 🐞 The demo page is stuck on "Loading…" forever; the console/Network show fetchUser being called nonstop.
// Goal: each userId is fetched only once; going back to a user you've seen → shows immediately, no "Loading…".
// Keep as is: the `UseLab` export (prop `fetchUser`), the "An" / "Ben" buttons, the "Loading…" fallback.
import { Suspense, use, useState } from "react";
import { delay } from "../testUtils";

export interface LabUser {
  id: string;
  name: string;
}

const USERS: Record<string, LabUser> = {
  u1: { id: "u1", name: "An" },
  u2: { id: "u2", name: "Ben" },
};

let demoCalls = 0;
function demoFetchUser(id: string) {
  console.log(`[lab10] fetchUser(${id}) call ${++demoCalls}`);
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
        <button onClick={() => setUserId("u2")}>Ben</button>
      </div>
      <Suspense fallback={<p>Loading…</p>}>
        <UserProfile userId={userId} fetchUser={fetchUser} />
      </Suspense>
    </div>
  );
}
