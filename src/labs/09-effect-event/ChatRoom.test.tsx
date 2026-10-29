import { render } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { ChatRoom, type Connection } from "./ChatRoom";

test("chỉ kết nối lại khi roomId đổi, thông báo dùng theme mới nhất", () => {
  const disconnect = vi.fn();
  const connect = vi.fn(
    (): Connection => ({ onConnected: (cb) => cb(), disconnect }),
  );
  const notify = vi.fn();

  // notify là arrow function mới mỗi lần render — giống cách dùng thật.
  const ui = (roomId: string, theme: "light" | "dark") => (
    <ChatRoom
      roomId={roomId}
      theme={theme}
      connect={connect}
      notify={(m, t) => notify(m, t)}
    />
  );

  const { rerender } = render(ui("general", "light"));
  expect(connect).toHaveBeenCalledTimes(1);
  expect(notify).toHaveBeenLastCalledWith("Đã kết nối #general", "light");

  rerender(ui("general", "dark"));
  expect(connect).toHaveBeenCalledTimes(1);
  expect(disconnect).not.toHaveBeenCalled();

  rerender(ui("travel", "dark"));
  expect(connect).toHaveBeenCalledTimes(2);
  expect(disconnect).toHaveBeenCalledTimes(1);
  expect(notify).toHaveBeenLastCalledWith("Đã kết nối #travel", "dark");
});
