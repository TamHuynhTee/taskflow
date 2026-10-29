import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { KeyLab } from "./KeyLab";

test("switching cards → the edit field shows the new card's title", () => {
  render(<KeyLab />);
  const input = () => screen.getByLabelText("Title") as HTMLInputElement;
  fireEvent.change(input(), { target: { value: "Draft for card 1" } });
  fireEvent.click(screen.getByRole("button", { name: "Write API docs" }));
  expect(input().value).toBe("Write API docs");
});

test("after saving the new title still shows; going back to the old card shows the saved title", () => {
  render(<KeyLab />);
  const input = () => screen.getByLabelText("Title") as HTMLInputElement;
  fireEvent.change(input(), { target: { value: "Login OK" } });
  fireEvent.click(screen.getByRole("button", { name: "Save" }));
  expect(input().value).toBe("Login OK");
  fireEvent.click(screen.getByRole("button", { name: "Write API docs" }));
  fireEvent.click(screen.getByRole("button", { name: "Login OK" }));
  expect(input().value).toBe("Login OK");
});
