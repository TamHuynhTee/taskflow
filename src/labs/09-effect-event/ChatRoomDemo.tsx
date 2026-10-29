import { useState } from "react";
import { ChatRoom, type Connection, type Theme } from "./ChatRoom";

// Fake functions live outside the component → stable references, not the cause of the bug.
function connect(roomId: string): Connection {
  console.log(`🔌 connect #${roomId}`);
  const timer = setTimeout(() => callback?.(), 300);
  let callback: (() => void) | undefined;
  return {
    onConnected: (cb) => (callback = cb),
    disconnect: () => {
      clearTimeout(timer);
      console.log(`❌ disconnect #${roomId}`);
    },
  };
}

export function ChatRoomDemo() {
  const [roomId, setRoomId] = useState("general");
  const [theme, setTheme] = useState<Theme>("light");
  const [log, setLog] = useState<string[]>([]);

  return (
    <div className="lab-col">
      <div className="lab-row">
        <select value={roomId} onChange={(e) => setRoomId(e.target.value)}>
          <option value="general">general</option>
          <option value="travel">travel</option>
          <option value="music">music</option>
        </select>
        <button onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}>
          Theme: {theme}
        </button>
      </div>
      <ChatRoom
        roomId={roomId}
        theme={theme}
        connect={connect}
        notify={(msg, t) => setLog((l) => [`${msg} (theme ${t})`, ...l].slice(0, 5))}
      />
      <ul>
        {log.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
    </div>
  );
}
