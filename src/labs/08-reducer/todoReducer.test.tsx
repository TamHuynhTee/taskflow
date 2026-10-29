import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { TodoLab } from "./TodoLab";
import { todoReducer, type Todo, type TodoAction } from "./todoReducer";

const base: Todo[] = Object.freeze([
  Object.freeze({ id: "t1", text: "A", done: false }),
  Object.freeze({ id: "t2", text: "B", done: true }),
]) as Todo[];

test.each<TodoAction>([
  { type: "toggled", id: "t1" },
  { type: "removed", id: "t2" },
])("không mutate state cũ: %o", (action) => {
  const next = todoReducer(base, action);
  expect(next).not.toBe(base);
  expect(base).toHaveLength(2);
  expect(base[0].done).toBe(false);
});

test("removed với id không tồn tại không xoá nhầm phần tử cuối", () => {
  expect(todoReducer(base, { type: "removed", id: "nope" })).toEqual(base);
});

test("added là hàm thuần: cùng input → cùng output", () => {
  // Nếu bạn đổi payload của "added" (vd. thêm id), sửa action dưới đây cho khớp.
  const action = { type: "added", text: "C", id: "t3" } as TodoAction;
  const a = todoReducer(base, action);
  const b = todoReducer(base, action);
  expect(a).toEqual(b);
  expect(a).toHaveLength(3);
});

test("UI cập nhật khi thêm, tick và xoá", () => {
  render(<TodoLab />);
  fireEvent.change(screen.getByLabelText("Việc mới"), { target: { value: "Viết test" } });
  fireEvent.click(screen.getByRole("button", { name: "Thêm" }));
  expect(screen.getByText("Viết test")).toBeInTheDocument();

  const box = screen.getByRole("checkbox", { name: "Viết test" });
  fireEvent.click(box);
  expect(box).toBeChecked();

  fireEvent.click(screen.getByRole("button", { name: "Xoá Viết test" }));
  expect(screen.queryByText("Viết test")).not.toBeInTheDocument();
});
