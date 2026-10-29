// LAB 08 — Reducer phải thuần và immutable
// 🐞 Bấm "Thêm"/tick checkbox/"Xoá": giao diện không đổi (hoặc đổi chậm một nhịp).
// 🐞 Chạy reducer 2 lần với cùng input cho ra 2 kết quả khác nhau.
// Giữ nguyên: export `todoReducer`, `Todo`, `TodoAction`. Có thể đổi payload của action "added"
// nếu cần (vd. truyền id từ ngoài vào) — nhớ sửa cả TodoLab.tsx.
export interface Todo {
  id: string;
  text: string;
  done: boolean;
}

export type TodoAction =
  | { type: "added"; text: string }
  | { type: "toggled"; id: string }
  | { type: "removed"; id: string };

export function todoReducer(todos: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case "added": {
      todos.push({
        id: Math.random().toString(36).slice(2),
        text: action.text,
        done: false,
      });
      return todos;
    }
    case "toggled": {
      const todo = todos.find((t) => t.id === action.id);
      if (todo) todo.done = !todo.done;
      return todos;
    }
    case "removed": {
      const index = todos.findIndex((t) => t.id === action.id);
      todos.splice(index, 1);
      return todos;
    }
  }
}
