import { useEffect, useEffectEvent, useState, type Ref } from "react";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useFilterParams } from "../../hooks/useFilterParams";
import { SearchBox } from "./SearchBox";

/**
 * The board's search box. The text being typed lives HERE — the smallest component that needs it (T5.4a) —
 * so each keystroke re-renders only this box, not the whole board. The board only gets `q`
 * in the URL after typing stops for 300ms (useDebouncedValue, T2.4).
 */
export function BoardSearch({ ref }: { ref?: Ref<HTMLInputElement> }) {
  const [{ query }, setParams] = useFilterParams();
  const [text, setText] = useState(query);
  const debounced = useDebouncedValue(text, 300);

  // Effect Event: read the latest `query` without making it a dependency.
  const commit = useEffectEvent((q: string) => {
    if (q !== query) setParams({ query: q });
  });
  useEffect(() => commit(debounced), [debounced]);

  return (
    <SearchBox
      ref={ref}
      value={text}
      onChange={(e) => setText(e.target.value)}
      onClear={
        text
          ? () => {
              setText("");
              setParams({ query: "" });
            }
          : undefined
      }
    />
  );
}
