// LAB 09 — Separating "events" from effects (useEffectEvent)
// 🐞 Changing the theme → the chat room DISCONNECTS and reconnects (see the console), even though the room didn't change.
// Goal: only reconnect when `roomId` changes; the "Connected" notification still uses the LATEST theme.
// Keep as is: the `ChatRoom` export and its props. Don't disable the exhaustive-deps lint to "sneak around" it.
import { useEffect, useEffectEvent } from "react";

export type Theme = "light" | "dark";

export interface Connection {
  onConnected(callback: () => void): void;
  disconnect(): void;
}

interface ChatRoomProps {
  roomId: string;
  theme: Theme;
  connect: (roomId: string) => Connection;
  notify: (message: string, theme: Theme) => void;
}

export function ChatRoom({ roomId, theme, connect, notify }: ChatRoomProps) {
  const onConnected = useEffectEvent(() =>
    notify(`Connected to #${roomId}`, theme),
  );

  // Why: theme/notify is used when event "connected" happen, should not be dependencies to reconnect.
  useEffect(() => {
    const connection = connect(roomId);
    connection.onConnected(onConnected);
    return () => connection.disconnect();
  }, [roomId, connect]);

  return <h3>Room #{roomId}</h3>;
}
