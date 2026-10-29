import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { KeyLab } from "./KeyLab";

test("đổi card → ô sửa hiện đúng tiêu đề card mới", () => {
  render(<KeyLab />);
  const input = () => screen.getByLabelText("Tiêu đề") as HTMLInputElement;
  fireEvent.change(input(), { target: { value: "Bản nháp card 1" } });
  fireEvent.click(screen.getByRole("button", { name: "Viết tài liệu API" }));
  expect(input().value).toBe("Viết tài liệu API");
});

test("lưu xong vẫn hiện tiêu đề mới; quay lại card cũ thấy tiêu đề đã lưu", () => {
  render(<KeyLab />);
  const input = () => screen.getByLabelText("Tiêu đề") as HTMLInputElement;
  fireEvent.change(input(), { target: { value: "Đăng nhập OK" } });
  fireEvent.click(screen.getByRole("button", { name: "Lưu" }));
  expect(input().value).toBe("Đăng nhập OK");
  fireEvent.click(screen.getByRole("button", { name: "Viết tài liệu API" }));
  fireEvent.click(screen.getByRole("button", { name: "Đăng nhập OK" }));
  expect(input().value).toBe("Đăng nhập OK");
});
