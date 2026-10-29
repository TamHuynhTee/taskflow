import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import App from "../App";

test("chưa đăng nhập → chuyển tới màn đăng nhập", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(JSON.stringify([{ id: "u1", name: "An", avatarColor: "#f00" }])),
  );
  render(<App />);
  expect(screen.getByRole("heading", { name: "TaskFlow" })).toBeInTheDocument();
  expect(await screen.findByRole("button", { name: /An/ }, { timeout: 3000 })).toBeInTheDocument();
  expect(location.pathname).toBe("/login");
});
