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
    result = ref.current!.open("Xoá card?", { confirmText: "Xoá", danger: true });
  });
  expect(await screen.findByRole("dialog", { name: "Xác nhận" })).toBeInTheDocument();
  return result;
}

test("Đồng ý → true, modal đóng", async () => {
  const result = openDialog();
  await userEvent.click(await screen.findByRole("button", { name: "Xoá" }));
  await expect(result).resolves.toBe(true);
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("Esc → huỷ (false), modal render trong body qua portal", async () => {
  const result = openDialog();
  const dialog = await screen.findByRole("dialog");
  expect(dialog.parentElement?.parentElement).toBe(document.body);
  await userEvent.keyboard("{Escape}");
  await expect(result).resolves.toBe(false);
});
