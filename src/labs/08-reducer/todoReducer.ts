// LAB 08 — A reducer must be pure and immutable
// 🐞 Clicking "Add"/ticking a checkbox/"Delete": the UI doesn't change (or changes one step late).
// 🐞 Running the reducer twice with the same input gives 2 different results.
// Keep as is: the `todoReducer`, `Todo`, `TodoAction` exports. You may change the "added" action's payload
// if needed (e.g. pass the id in from outside) — remember to update TodoLab.tsx too.
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
