// LAB 03 — An object in the dependency array
// 🐞 Open the Network tab/console: `load` is called over and over without stopping (a render ↔ effect loop).
// Keep as is: the `BoardCards` export, the `boardId` + `load` props. load may only be called once per boardId.
// Don't "fix" it with empty deps [] — changing boardId must still reload.
import { useEffect, useState } from "react";

export interface LoadOptions {
  boardId: string;
  includeArchived: boolean;
}

let demoCalls = 0;
async function demoLoad(options: LoadOptions) {
  demoCalls++;
  console.log(`[lab03] load call ${demoCalls}`, options);
  await new Promise((r) => setTimeout(r, 300));
  return [`Card A of ${options.boardId}`, `Card B of ${options.boardId}`];
}

export function BoardCards({
  boardId,
  load = demoLoad,
}: {
  boardId: string;
  load?: (options: LoadOptions) => Promise<string[]>;
}) {
  const [cards, setCards] = useState<string[]>([]);

  useEffect(() => {
    let ignore = false;

    const options = { boardId, includeArchived: false };
    load(options).then((res) => {
      if (!ignore) setCards(res);
    });

    return () => {
      ignore = true;
    };
  }, [boardId, load]);
  // Passing object to dependency arr will trigger infinite re-runs

  return (
    <ul>
      {cards.map((c) => (
        <li key={c}>{c}</li>
      ))}
    </ul>
  );
}
