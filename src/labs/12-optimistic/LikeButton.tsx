// LAB 12 — useOptimistic  (IMPLEMENT exercise)
// Right now: clicking ❤️ waits for the server (1.5s) before the number goes up — the app feels "frozen".
// Goal:
//   1. Click → the number goes up IMMEDIATELY (+1), the button has aria-busy="true" while waiting.
//   2. Server OK → show the number the server returned.
//   3. Server error → the number reverts on its own + show role="alert" "Couldn't send".
// Use useOptimistic + startTransition (or <form action>). Don't hand-roll a "pendingLikes" state.
// Keep as is: the `LikeButton` export (props `initialLikes`, `sendLike`), a button named "❤️ <number>".
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
  /** Takes the current like count, returns the new like count from the server. */
  sendLike?: (current: number) => Promise<number>;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [error, setError] = useState("");

  async function handleClick() {
    setError("");
    try {
      setLikes(await sendLike(likes));
    } catch {
      setError("Couldn't send");
    }
  }

  return (
    <div className="lab-row">
      <button onClick={handleClick}>❤️ {likes}</button>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
