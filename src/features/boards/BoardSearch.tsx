import { useEffect, useEffectEvent, useState, type Ref } from "react";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { useFilterParams } from "../../hooks/useFilterParams";
import { SearchBox } from "./SearchBox";

/**
 * Ô tìm kiếm của board. State chữ đang gõ nằm Ở ĐÂY — component nhỏ nhất cần nó (T5.4a) —
 * nên mỗi phím gõ chỉ render lại ô này, không render lại cả board. Board chỉ nhận `q`
 * trên URL sau khi ngừng gõ 300ms (useDebouncedValue, T2.4).
 */
export function BoardSearch({ ref }: { ref?: Ref<HTMLInputElement> }) {
  const [{ query }, setParams] = useFilterParams();
  const [text, setText] = useState(query);
  const debounced = useDebouncedValue(text, 300);

  // Effect Event: đọc `query` mới nhất mà không biến nó thành dependency.
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
