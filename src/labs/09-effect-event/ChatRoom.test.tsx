import { render } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { ChatRoom, type Connection } from "./ChatRoom";

test("only reconnects when roomId changes; the notification uses the latest theme", () => {
  const disconnect = vi.fn();
  const connect = vi.fn(
    (): Connection => ({ onConnected: (cb) => cb(), disconnect }),
  );
  const notify = vi.fn();

  // notify is a new arrow function every render — just like real usage.
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
  expect(notify).toHaveBeenLastCalledWith("Connected to #general", "light");

  rerender(ui("general", "dark"));
  expect(connect).toHaveBeenCalledTimes(1);
  expect(disconnect).not.toHaveBeenCalled();

  rerender(ui("travel", "dark"));
  expect(connect).toHaveBeenCalledTimes(2);
  expect(disconnect).toHaveBeenCalledTimes(1);
  expect(notify).toHaveBeenLastCalledWith("Connected to #travel", "dark");
});
