// LAB 09 — Tách "sự kiện" ra khỏi effect (useEffectEvent)
// 🐞 Đổi theme → phòng chat bị NGẮT KẾT NỐI rồi kết nối lại (xem console), dù phòng không đổi.
// Mục tiêu: chỉ kết nối lại khi `roomId` đổi; thông báo "Đã kết nối" vẫn dùng theme MỚI NHẤT.
// Giữ nguyên: export `ChatRoom` và các props. Không được tắt lint exhaustive-deps để "lách".
import { useEffect } from "react";

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
  useEffect(() => {
    const connection = connect(roomId);
    connection.onConnected(() => notify(`Đã kết nối #${roomId}`, theme));
    return () => connection.disconnect();
  }, [roomId, theme, connect, notify]);

  return <h3>Phòng #{roomId}</h3>;
}
