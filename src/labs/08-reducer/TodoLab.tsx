import { useReducer, useState } from "react";
import { todoReducer } from "./todoReducer";

export function TodoLab() {
  const [todos, dispatch] = useReducer(todoReducer, [
    { id: "t1", text: "Read the useReducer docs", done: false },
  ]);
  const [text, setText] = useState("");

  return (
    <div className="lab-col">
      <form
        className="lab-row"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          dispatch({
            type: "added",
            text: text.trim(),
            id: crypto.randomUUID(),
          });
          setText("");
        }}
      >
        <input
          aria-label="New todo"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {todos.map((t) => (
          <li key={t.id}>
            <label>
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => dispatch({ type: "toggled", id: t.id })}
              />
              {t.text}
            </label>
            <button onClick={() => dispatch({ type: "removed", id: t.id })}>
              Delete {t.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
