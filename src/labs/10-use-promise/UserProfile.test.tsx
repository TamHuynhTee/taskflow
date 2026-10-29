import { act, fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { UseLab, type LabUser } from "./UserProfile";

test("each user is fetched only once and a user you've seen shows up immediately", async () => {
  const names: Record<string, string> = { u1: "An", u2: "Ben" };
  const fetchUser = vi.fn(
    (id: string) =>
      new Promise<LabUser>((r) => setTimeout(() => r({ id, name: names[id] }), 10)),
  );
  // The component suspends → render/click must be inside `await act(async ...)`.
  const click = (name: string) =>
    act(async () => {
      fireEvent.click(screen.getByRole("button", { name }));
    });

  await act(async () => {
    render(<UseLab fetchUser={fetchUser} />);
  });
  expect(await screen.findByText("👤 An", {}, { timeout: 800 })).toBeInTheDocument();

  await click("Ben");
  expect(await screen.findByText("👤 Ben", {}, { timeout: 800 })).toBeInTheDocument();

  await click("An");
  expect(screen.getByText("👤 An")).toBeInTheDocument();
  expect(screen.queryByText("Loading…")).not.toBeInTheDocument();
  expect(fetchUser).toHaveBeenCalledTimes(2);
});
