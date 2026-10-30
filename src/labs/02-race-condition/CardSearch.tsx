// LAB 02 — Race condition when fetching in an effect
// 🐞 Type "lo" quickly: the "l" request (slow) arrives AFTER the "lo" request (fast) and overwrites the result →
//    the box says "lo" but the list shows the results for "l".
// Keep as is: the `CardSearch` export, the `search` prop, the input labelled "Search cards", results as <li>.
import { useEffect, useState } from "react";
import { delay } from "../testUtils";

const TITLES = [
  "home page layout",
  "login with Google",
  "new logo",
  "payment bug",
  "landing page",
];

/** Fake API: the SHORTER the query, the SLOWER the response — so the bug is easy to see on the demo page. */
function fakeSearch(q: string) {
  const found = TITLES.filter((t) => t.includes(q));
  return delay(1500 / q.length, found);
}

export function CardSearch({
  search = fakeSearch,
}: {
  search?: (query: string) => Promise<string[]>;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    let ignore = false;
    if (!query) {
      setResults([]);
      return;
    }
    search(query).then((res) => {
      // cleanup marks this run stale; a late response from an old query is dropped
      if (!ignore) setResults(res);
    });

    return () => {
      ignore = true;
    };
  }, [query, search]);

  return (
    <div>
      <input
        aria-label="Search cards"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type fast: lo"
      />
      <ul>
        {results.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </div>
  );
}
