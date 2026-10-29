import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { expect, test } from "vitest";
import { ConfirmDialog, type ConfirmDialogHandle } from "./ConfirmDialog";

async function openDialog() {
  const ref = createRef<ConfirmDialogHandle>();
  render(<ConfirmDialog ref={ref} />);
  let result!: Promise<boolean>;
  act(() => {
    result = ref.current!.open("Delete card?", { confirmText: "Delete", danger: true });
  });
  expect(await screen.findByRole("dialog", { name: "Confirm" })).toBeInTheDocument();
  return result;
}

test("confirm → true, modal closes", async () => {
  const result = openDialog();
  await userEvent.click(await screen.findByRole("button", { name: "Delete" }));
  await expect(result).resolves.toBe(true);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("Esc → cancel (false), modal renders into body through a portal", async () => {
  const result = openDialog();
  const dialog = await screen.findByRole("dialog");
  expect(dialog.parentElement?.parentElement).toBe(document.body);
  await userEvent.keyboard("{Escape}");
  await expect(result).resolves.toBe(false);
});
