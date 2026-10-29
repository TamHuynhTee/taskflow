import { act, fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { deferred } from "../testUtils";
import { LikeButton } from "./LikeButton";

test("goes up immediately, keeps the server number on success, reverts on error", async () => {
  const ok = deferred<number>();
  const fail = deferred<number>();
  const sendLike = vi
    .fn<(n: number) => Promise<number>>()
    .mockReturnValueOnce(ok.promise)
    .mockReturnValueOnce(fail.promise);

  render(<LikeButton initialLikes={10} sendLike={sendLike} />);

  fireEvent.click(screen.getByRole("button", { name: "❤️ 10" }));
  const pending = screen.getByRole("button", { name: "❤️ 11" });
  expect(pending).toHaveAttribute("aria-busy", "true");

  await act(async () => ok.resolve(11));
  expect(screen.getByRole("button", { name: "❤️ 11" })).not.toHaveAttribute("aria-busy", "true");

  fireEvent.click(screen.getByRole("button", { name: "❤️ 11" }));
  expect(screen.getByRole("button", { name: "❤️ 12" })).toBeInTheDocument();

  await act(async () => fail.reject(new Error("500")));
  expect(screen.getByRole("button", { name: "❤️ 11" })).toBeInTheDocument();
  expect(screen.getByRole("alert")).toHaveTextContent("Couldn't send");
});
