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
])("does not mutate the old state: %o", (action) => {
  const next = todoReducer(base, action);
  expect(next).not.toBe(base);
  expect(base).toHaveLength(2);
  expect(base[0].done).toBe(false);
});

test("removed with an unknown id doesn't delete the last item by mistake", () => {
  expect(todoReducer(base, { type: "removed", id: "nope" })).toEqual(base);
});

test("added is pure: same input → same output", () => {
  // If you change the "added" payload (e.g. add an id), update the action below to match.
  const action = { type: "added", text: "C", id: "t3" } as TodoAction;
  const a = todoReducer(base, action);
  const b = todoReducer(base, action);
  expect(a).toEqual(b);
  expect(a).toHaveLength(3);
});

test("the UI updates when adding, ticking and deleting", () => {
  render(<TodoLab />);
  fireEvent.change(screen.getByLabelText("New todo"), { target: { value: "Write tests" } });
  fireEvent.click(screen.getByRole("button", { name: "Add" }));
  expect(screen.getByText("Write tests")).toBeInTheDocument();

  const box = screen.getByRole("checkbox", { name: "Write tests" });
  fireEvent.click(box);
  expect(box).toBeChecked();

  fireEvent.click(screen.getByRole("button", { name: "Delete Write tests" }));
  expect(screen.queryByText("Write tests")).not.toBeInTheDocument();
});
