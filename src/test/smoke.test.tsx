import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import App from "../App";

test("not signed in → redirects to the login screen", async () => {
  vi.spyOn(globalThis, "fetch").mockResolvedValue(
    new Response(JSON.stringify([{ id: "u1", name: "An", avatarColor: "#f00" }])),
  );
  render(<App />);
  expect(screen.getByRole("heading", { name: "TaskFlow" })).toBeInTheDocument();
  expect(await screen.findByRole("button", { name: /An/ }, { timeout: 3000 })).toBeInTheDocument();
  expect(location.pathname).toBe("/login");
});
