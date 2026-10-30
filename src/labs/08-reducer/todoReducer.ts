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
  | { type: "added"; text: string; id: string }
  | { type: "toggled"; id: string }
  | { type: "removed"; id: string };

export function todoReducer(todos: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case "added": {
      const newRecord = {
        id: action.id,
        text: action.text,
        done: false,
      };
      return [...todos, newRecord];
    }
    case "toggled": {
      return todos.map((td) =>
        td.id === action.id ? { ...td, done: !td.done } : td,
      );
    }
    case "removed": {
      return todos.filter((td) => td.id !== action.id);
    }
  }
}
