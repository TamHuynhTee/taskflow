# Labs — Advanced React

12 small exercises. Each one is **a component with a bug** (🐞) or **something left to implement** (🛠).
No API or login needed.

```bash
npm run test:labs          # self-check: tests stay RED until your fix is right
npm run test:labs:watch    # watch the tests while you edit
npm run dev                # demos: http://localhost:5173/labs
```

How to work through each lab:
1. Open the demo `/labs/NN` and **reproduce the bug** yourself (with the Console / React DevTools open).
2. Read the comment at the top of the file: it describes the bug + what must stay as is (export names, button text…) because the tests rely on it.
3. **Explain in words** why the bug happens *before* fixing it. Write a 1–2 line `// Why:` comment in the file.
4. Fix it → `npm run test:labs` goes green for that lab. Don't edit the test files (except where a test says you may).
5. Send **"review lab NN"** to get a review.

Hints are hidden in `<details>` — try thinking on your own for ≥ 15 minutes before opening them.

| # | Lab | Concept | Type |
| --- | --- | --- | --- |
| 01 | The frozen stopwatch | Stale closure, updater function | 🐞 |
| 02 | Search results jump around | Race condition, cleanup | 🐞 |
| 03 | The fetch that never stops | Referential equality, deps | 🐞 |
| 04 | memo, yet it still re-renders | `memo`, `useCallback`, stable props | 🐞 |
| 05 | Context drags the whole tree along | Context value, splitting contexts | 🐞 |
| 06 | The lab crashes because of getSnapshot | `useSyncExternalStore` | 🐞 |
| 07 | The draft sticks to another card | Resetting state with `key` | 🐞 |
| 08 | The reducer that ignores clicks | Immutability, pure reducers | 🐞 |
| 09 | Changing the theme drops the connection | `useEffectEvent` | 🐞 |
| 10 | Suspense stuck forever | `use(promise)`, caching promises | 🐞 |
| 11 | Async errors slip past the Error Boundary | Error Boundary + async | 🛠 |
| 12 | The like button waits for the server | `useOptimistic`, transitions | 🛠 |

---

### 01 — The frozen stopwatch · `src/labs/01-stale-closure/Stopwatch.tsx`
Press "Start": the stopwatch goes to 1 and then freezes. `npm run lint` is also trying to tell you something.
- Question: which render's `seconds` does the function inside `setInterval` "see"?
- There are at least 2 fixes. Which one doesn't need to recreate the interval every second? Why is it better?
<details><summary>Hint</summary>

The closure captures `seconds` from the render when the effect ran (= 0) → it's always `setSeconds(0 + 1)`. Use the updater `setSeconds(s => s + 1)`: React passes in the latest value, so the effect doesn't need to depend on `seconds`.
</details>

### 02 — Search results jump around · `src/labs/02-race-condition/CardSearch.tsx`
Type "lo" really fast in the demo: the final results are the ones for "l". There are 2 tests: requests arriving out of order, and clearing the search box before an old request comes back.
<details><summary>Hint</summary>

Every time the effect re-runs, the previous run's cleanup runs first. Put `let ignore = false` in the effect, set `ignore = true` in the cleanup, and only call `setResults` when `!ignore`. (Or an `AbortController` if the API supports `signal` — like `useFetch` in the app.)
</details>

### 03 — The fetch that never stops · `src/labs/03-object-deps/BoardCards.tsx`
The console logs "load call 1, 2, 3…" forever. You may not fix it with `[]`.
- Question: is `{ a: 1 } === { a: 1 }`? How does React compare deps?
<details><summary>Hint</summary>

`options` is a new object every render → the deps always "change" → the effect runs → `setCards` → render → new object… Create the object **inside** the effect and depend on the primitive `boardId`. (`useMemo` works too, but it's overkill here.) Remember to add the race cleanup from lab 02.
</details>

### 04 — memo, yet it still re-renders · `src/labs/04-memo/CardPicker.tsx`
There are 2 things defeating `memo`. Turn on React DevTools › Components › ⚙ › "Highlight updates when components render".
<details><summary>Hint</summary>

`memo` shallow-compares each prop: `style={{...}}` and `onSelect={() => ...}` are new references every render. Move the style into a constant outside the component; have `CardRow` call `onSelect(title)` so the parent can pass `setSelected` directly (useState's setter is always stable) — or use `useCallback`.
Bonus question: with the React Compiler on, does this lab still have the bug?
</details>

### 05 — Context drags the whole tree along · `src/labs/05-context/ContextLab.tsx`
Two separate problems: (1) Tick re-renders every consumer; (2) Toggle theme re-renders `ToggleButton` too.
<details><summary>Hint</summary>

(1) `value={{...}}` is new every render → every consumer re-renders. `useMemo` the value (and use `useCallback`/a stable function for toggle).
(2) One context holds both frequently changing data (`theme`) and a function that never changes (`toggle`) → split it into 2 contexts: `ThemeStateContext` and `ThemeActionsContext` — like `BoardStateContext`/`BoardDispatchContext` in T3.3.
Why don't `children` re-render when the Provider re-renders? (see T5.4b)
</details>

### 06 — The lab crashes because of getSnapshot · `src/labs/06-external-store/WindowSize.tsx`
<details><summary>Hint</summary>

`getSnapshot` is called many times and React compares the results with `Object.is`. Returning a new object each time → React thinks the store always changed → infinite renders. Cache the snapshot (only create a new object when width/height actually change), or use 2 hooks that return primitive numbers. Bonus: the 3rd parameter, `getServerSnapshot`.
</details>

### 07 — The draft sticks to another card · `src/labs/07-key-reset/KeyLab.tsx`
`useEffect(() => setDraft(card.title), [card])` is not allowed — try writing it first to see why it's bad (an extra render, the old value flashes for a frame, it wipes out typed text when the parent re-renders).
<details><summary>Hint</summary>

`useState(card.title)` only uses the initial value on mount. Same position + same component type = React keeps the state. `<CardEditor key={card.id} />` → a different card is a new component with new state.
</details>

### 08 — The reducer that ignores clicks · `src/labs/08-reducer/todoReducer.ts`
There are 4 bugs: `push`, assigning `todo.done`, `splice` (and `findIndex` returning `-1`!), and `Math.random()` inside the reducer.
<details><summary>Hint</summary>

React skips the render if the reducer returns **the same reference** (`Object.is`). Use spread/`map`/`filter`. A reducer must be pure (StrictMode calls it twice!) → generate the id in the event handler: `dispatch({ type: "added", id: crypto.randomUUID(), text })`.
</details>

### 09 — Changing the theme drops the connection · `src/labs/09-effect-event/ChatRoom.tsx`
The test passes `notify` as a new arrow function every render — just removing `theme` from the deps isn't enough.
<details><summary>Hint</summary>

"Connecting to the room" is something that *reacts* to `roomId`; "notifying with the current theme" is an *event* — you want the latest value but don't want it to re-run the effect. `const onConnected = useEffectEvent(() => notify(..., theme))`, call it inside the effect, and the deps become just `[roomId, connect]`.
</details>

### 10 — Suspense stuck forever · `src/labs/10-use-promise/UserProfile.tsx`
<details><summary>Hint</summary>

`use(fetchUser(id))` creates a new promise every render → suspend → resolve → re-render → new promise… Cache the promise **outside** the component (a Map keyed by `userId`, see `src/api/promiseCache.ts`). Note: the test passes its own `fetchUser` — the cache should be tied to `fetchUser` (e.g. `WeakMap<fetchUser, Map<id, Promise>>`), or pass the promise in from the parent. Why can't you use `useState`/`useMemo` inside `UserProfile` itself? (hint: the state of a component that suspends on its first render is thrown away).
</details>

### 11 — Async errors slip past the Error Boundary (🛠) · `src/labs/11-async-error/ReportLab.tsx`
Requirements: `load()`'s error shows in the boundary's fallback, "Retry" works, and the button is disabled while loading.
<details><summary>Hint</summary>

A boundary only catches errors thrown **during render**. Catch the error in the handler (`try/catch`), store it in state, then `if (error) throw error` in the component body. (Another trick: `setState(() => { throw error })`.) Bonus: write a reusable `useAsyncError()` hook.
</details>

### 12 — The like button waits for the server (🛠) · `src/labs/12-optimistic/LikeButton.tsx`
<details><summary>Hint</summary>

`const [optimisticLikes, addOptimistic] = useOptimistic(likes, (n) => n + 1)`. Inside `startTransition(async () => { addOptimistic(); try { const n = await sendLike(likes); startTransition(() => setLikes(n)) } catch { ... } })`. The optimistic value only lives while the transition is running — once it ends (even with an error) it falls back to the real `likes`. `aria-busy` = `optimisticLikes !== likes`. Why does `setLikes` after `await` need to be wrapped in `startTransition` again?
</details>

---

## Extension exercises (no tests — check with DevTools)

Done on the main TaskFlow app:

- **E1 · React Compiler:** turn on the compiler (T5.7) and re-run labs 04 & 05 — which tests turn green on their own? Why does part (2) of lab 05 stay red?
- **E2 · `useTransition` for filters:** in `BoardPage`, filtering 5,000 cards (`npm run api:big`) stutters when ticking a label. Wrap `FilterPanel`'s URL update in `startTransition` and dim the board while `isPending`. Compare with `useDeferredValue`.
- **E3 · Ref callback cleanup (React 19):** write `useAutoHeight()` that returns a ref callback using `ResizeObserver`, and **return a cleanup function** from the ref callback (new in React 19) instead of using `useEffect`.
- **E4 · `useActionState` for renaming cards:** replace `InlineEdit` + `renameCard` with a `<form action>`; show the server error right under the field.
- **E5 · Cancel the optimistic move when leaving a board:** move a card (API delay 3s) and switch boards meanwhile — what happens to the toast/focus? Clean it up.
- **E6 · A real bug in the app:** `useKeyboardShortcut("n")` still opens the form while the card detail modal is open. Fix it so the shortcut is off whenever any modal is open (hint: `modalStack` in `Modal.tsx`, or an "overlay" context).
