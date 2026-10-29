import { act, fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { UseLab, type LabUser } from "./UserProfile";

test("mỗi user chỉ fetch 1 lần và user đã xem hiện ngay", async () => {
  const names: Record<string, string> = { u1: "An", u2: "Bình" };
  const fetchUser = vi.fn(
    (id: string) =>
      new Promise<LabUser>((r) => setTimeout(() => r({ id, name: names[id] }), 10)),
  );
  // Component suspend → render/click phải nằm trong `await act(async ...)`.
  const click = (name: string) =>
    act(async () => {
      fireEvent.click(screen.getByRole("button", { name }));
    });

  await act(async () => {
    render(<UseLab fetchUser={fetchUser} />);
  });
  expect(await screen.findByText("👤 An", {}, { timeout: 800 })).toBeInTheDocument();

  await click("Bình");
  expect(await screen.findByText("👤 Bình", {}, { timeout: 800 })).toBeInTheDocument();

  await click("An");
  expect(screen.getByText("👤 An")).toBeInTheDocument();
  expect(screen.queryByText("Đang tải…")).not.toBeInTheDocument();
  expect(fetchUser).toHaveBeenCalledTimes(2);
});
