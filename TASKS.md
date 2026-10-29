# TaskFlow — React learning path

A mini Trello-style task manager. **All of the UI (presentational components + CSS) is already built** —
you only write the logic: state, hooks, effects, context, routing, API calls, performance tuning.
Work through it top to bottom; each task builds on the code from the previous one.
When you finish a task, tick it `[x]`, then send **"review T1.3"** to get a review.

> **Status (2026-10-29):** Levels 1–6 are done in their *final* form (later tasks replace earlier ones:
> `useState` → `useReducer` → Context; fetching in effects → `use()` + Suspense; controlled forms → Actions).
> The intermediate/"wrong" versions are kept as explanatory comments in the code.
> Still left for **you to measure/do by hand**: T5.1, T5.3, T5.4, T5.6, T5.7 (Profiler numbers go in `PERF.md`) and Level 7 (a separate Next.js project).
> Advanced React bug/implement exercises: see **[LABS.md](LABS.md)**.
>
> Differences from the spec: `createCardFromForm` returns `Omit<Card, "id">` (json-server assigns the id); `useCardActions()` computes `order` itself;
> the board's SearchBox is its own component, `BoardSearch` (the keystroke state lives there — T5.4a), and it debounces into `?q=` in the URL.

## Running the project

```bash
npm install
npm run db:reset   # create db.json from db.seed.json (re-run whenever you want to restore the data)
npm run dev        # app: http://localhost:5173 — UI samples: http://localhost:5173/#gallery
npm run api        # json-server: http://localhost:3001 (from Level 2)
npm run api:big    # json-server with 5,000 cards (Level 4.7, Level 5)
npm test           # Vitest
npm run lint       # oxlint (includes rules-of-hooks + exhaustive-deps)
```

json-server API: `/boards`, `/cards`, `/comments`, `/users`. Filtering: `/cards?boardId=b1`, `/comments?cardId=c1`. Supports `GET/POST/PUT/PATCH/DELETE`.
`src/api/client.ts` already has `request<T>(path, init)` with simulated delay + failures (set in `.env.local`, see `.env.example`).

## Conventions

| Kind of code | Where it goes | Who writes it |
| --- | --- | --- |
| Presentational components (props only, no API calls) | `src/components/`, `src/features/*/…View.tsx`, `CardItem`, `Column`, `BoardView`… | ✅ provided |
| Data types | `src/types.ts` | ✅ provided |
| Constants & lookup tables | `src/features/cards/cardMeta.ts` (`EMPTY_FILTER`, `EMPTY_CARD_FORM`, `isPriority`, `isLabel`…) | ✅ provided |
| **Components with logic** (state, effects, API calls) — "containers"/"pages" | `src/features/*/…Page.tsx`, `…Form.tsx`, `src/app/` | ✍️ you |
| **Pure functions** (filtering, validation, calculations) | next to the feature, e.g. `src/features/boards/filterCards.ts` | ✍️ you |
| **Custom hooks** | `src/hooks/useXxx.ts` | ✍️ you |
| **Context** | `src/context/XxxContext.tsx` | ✍️ you |
| **API functions** | `src/api/boards.ts`, `cards.ts`, `comments.ts` | ✍️ you |

Symbols used in each task:
📁 files to create/edit · ✍️ functions/components to write (with signatures) · 📋 detailed requirements · 🧩 ready-made UI to use · ✅ done criteria · 📖 reading to do first

## The ready-made UI kit

Open **http://localhost:5173/#gallery** to see everything running, and open `src/dev/Gallery.tsx` to see how props are passed.

| Component | File | Main props |
| --- | --- | --- |
| `Layout` | `components/Layout.tsx` | `sidebar`, `nav`, `headerActions`, `banner`, `children` |
| `ThemeToggle`, `UserMenu` | `components/HeaderWidgets.tsx` | `theme, onToggle` · `user, onLogout` |
| `Button`, `IconButton` | `components/ui/Button.tsx` | `variant`, `size`, `loading`, + every `<button>` prop |
| `TextField`, `TextAreaField`, `SelectField`, `CheckboxGroup` | `components/ui/Field.tsx` | `id`, `label`, `error`, `hint`, + input props |
| `Modal`, `ConfirmDialogView` | `components/ui/Modal.tsx` | `open`, `title`, `onClose`, `footer` |
| `ErrorMessage`, `EmptyState`, `Banner`, `ToastStack`, `RenderCounter` | `components/ui/Feedback.tsx` | see the file |
| `Spinner`, `Skeleton`, `BoardSkeleton`, `CardSkeleton`, `PageSkeleton` | `components/ui/Spinner.tsx` | — |
| `Tabs`, `StatTile`, `PageHeader`, `TooltipBox` | `components/ui/Misc.tsx` | see the file |
| `BoardView` | `features/boards/BoardView.tsx` | `board, cards, users, today, toolbar, getCardProps, onDropCard, renderColumnFooter, isStale` |
| `Column` | `features/boards/Column.tsx` | (used by BoardView) |
| `CardItem` | `features/cards/CardItem.tsx` | `onOpen, onDelete, onMove, onBumpPriority, onTitleDoubleClick, titleEditor, isPending, articleProps` |
| `BoardSidebar`, `FilterPanel`, `SearchBox`, `AddCardButton` | `features/boards/` | see the file |
| `InlineEdit` | `features/cards/InlineEdit.tsx` | `defaultValue, onCommit, onCancel` |
| `CardFormFields`, `FormActions`, `FormMessage` | `features/cards/CardFormFields.tsx` | `users, errors, values+onFieldChange` **or** `defaultValues`, `titleRef` |
| `CardDetail` | `features/cards/CardDetail.tsx` | `card, board, assignee, today, actions, children` |
| `CommentList`, `CommentListSkeleton`, `CommentComposerFields` | `features/cards/CommentList.tsx` | `comments, usersById` · `submit` |
| `LoginView` | `features/auth/LoginView.tsx` | `users, onSelect, loading` |
| `SettingsView` | `features/settings/SettingsView.tsx` | `theme, onThemeChange, user, onLogout` |
| `StatsOverview`, `ProfilerTable`, `CardRow`, `ListFrame`, `CARD_ROW_HEIGHT` | `features/stats/StatsViews.tsx` | see the file |
| `NotFoundView` | `pages/NotFoundView.tsx` | `action` |

> You may edit UI files when a task asks you to (e.g. T3.1 turns the buttons in `BoardSidebar` into `NavLink`s, T3.4 changes `Modal`, T3.6 changes `Field`). Otherwise treat them as a "library".

---

## Level 0 — Fundamentals: JSX & Components ✅ (already done)

Read the sample code carefully (it has explanatory comments) before moving on to Level 1:
- `src/features/cards/CardItem.tsx` — props, conditional rendering, lookups in `cardMeta.ts`
- `src/features/boards/Column.tsx` — lists + `key` (with a `key={index}` experiment), empty state
- `src/features/boards/BoardView.tsx` — derived data computed during render
- `src/components/Layout.tsx` — composition through `sidebar` + `children`
- `src/utils/date.ts` — a pure function, `today` passed in instead of calling `new Date()` during render

- [x] T0.1 Static `CardItem` · [x] T0.2 Lists & `key` · [x] T0.3 Conditional rendering · [x] T0.4 Pure components & composition

Try it yourself: in `Column.tsx`, pass `showNote` to `CardItem` and switch to `key={index}` to see the bug; try assigning `card.title = ...` inside `CardItem` to see why you mustn't mutate props.

---

## Level 1 — State & Events

Level 1 doesn't call the API yet: data comes from `src/data/sample.ts`.

- [x] **T1.1 — `useState`: delete / move / rename cards**
  - 📁 Create `src/features/boards/BoardPage.tsx`, `src/features/boards/cardUtils.ts`. Change `src/App.tsx` to render `<BoardPage />` instead of `<BoardView />`.
  - ✍️ `cardUtils.ts` (pure functions):
    - `nextColumnId(columnId: ColumnId, direction: 'left' | 'right'): ColumnId` — `todo ⇄ doing ⇄ done`, stays put at the edges.
    - `nextOrder(cards: Card[], boardId: string, columnId: ColumnId): number` — highest `order` in the column + 1 (empty column → 0).
  - ✍️ `BoardPage({ board, users, initialCards, today })`:
    - `const [cards, setCards] = useState<Card[]>(initialCards)`
    - `const [editingCardId, setEditingCardId] = useState<string | null>(null)`
    - `deleteCard(id: string)`, `moveCard(id: string, direction: 'left' | 'right')` (set `order = nextOrder(...)` in the new column), `renameCard(id: string, title: string)` (ignore empty titles).
  - 📋 Pass them to `BoardView` through `getCardProps={card => ({ onDelete, onMove, onTitleDoubleClick, titleEditor })}`. When `editingCardId === card.id`, `titleEditor` = `<InlineEdit defaultValue={card.title} onCommit={...} onCancel={...} />`.
  - 🧩 `BoardView`, `InlineEdit`.
  - ✅ Delete, ←/→, and double-click to rename (Enter saves, Esc cancels) all work. No `push`/`splice`/`sort()`/direct assignment to state elements — only `map`, `filter`, spread, `toSorted`.
  - 📖 [State: A Component's Memory](https://react.dev/learn/state-a-components-memory), [Updating Objects in State](https://react.dev/learn/updating-objects-in-state), [Updating Arrays in State](https://react.dev/learn/updating-arrays-in-state)

- [x] **T1.2 — Create-card form (controlled & uncontrolled)**
  - 📁 Create `src/features/cards/CreateCardForm.tsx`, `src/features/cards/cardForm.ts`.
  - ✍️ `cardForm.ts` (pure functions):
    - `validateCardForm(values: CardFormValues, today: string): CardFormErrors` — title required, trimmed, 3–100 characters; description ≤ 500; dueDate (if any) not before `today` (use `getDueStatus`). No errors → `{}`.
    - `createCardFromForm(values: CardFormValues, boardId: string, order: number): Card` — `id: crypto.randomUUID()`, `columnId: 'todo'`, `dueDate: values.dueDate || null`, `assigneeId: values.assigneeId || null`, `createdAt: new Date().toISOString()`.
    - `readCardForm(formData: FormData): CardFormValues` — use `get`/`getAll`, `isPriority`, `isLabel` to coerce types.
  - ✍️ `CreateCardForm({ users, onCreate, onCancel })` with `onCreate: (values: CardFormValues) => void`:
    - **Version 1 – controlled:** `const [values, setValues] = useState(EMPTY_CARD_FORM)`, `const [errors, setErrors] = useState<CardFormErrors>({})`; `onSubmit` → `preventDefault`, validate, `setErrors` on errors, otherwise `onCreate(values)` and reset the form.
    - **Version 2 – uncontrolled:** write `CreateCardFormUncontrolled` with the same props, without keeping `values` in state, reading with `readCardForm(new FormData(e.currentTarget))`. Add a comment comparing the 2 approaches.
  - 📋 In `BoardPage`: an `isCreateOpen` state; open the form with a "+ New card" button in `toolbar` and an `AddCardButton` in the "To do" column (`renderColumnFooter`). The form lives in a `<Modal>`. After creating, close the modal; the new card goes at the end of the "To do" column.
  - 🧩 `Modal`, `CardFormFields` (controlled: `values` + `onFieldChange`; uncontrolled: pass nothing), `FormActions`, `Button`, `AddCardButton`.
  - ✅ An invalid submit shows errors under the right fields; once fixed, the errors disappear on resubmit; both versions can create cards.
  - 📖 [Reacting to Input with State](https://react.dev/learn/reacting-to-input-with-state), [`<input>`](https://react.dev/reference/react-dom/components/input), [`<form>`](https://react.dev/reference/react-dom/components/form)

- [x] **T1.3 — Lifting state up: filters + search**
  - 📁 Create `src/features/boards/filterCards.ts`. Edit `App.tsx`, `BoardPage.tsx`.
  - ✍️ `filterCards(cards: Card[], filter: CardFilter, query: string): Card[]` — matches **all** conditions: the card has at least 1 label in `filter.labels` (empty = ignore); `priority`; `assigneeId`; `query` is case-insensitive and searches title + description.
  - 📋 The sidebar (`FilterPanel`) and the board (`BoardPage`) are siblings → the state must live in their common parent `App`:
    - `App`: `const [filter, setFilter] = useState(EMPTY_FILTER)`, `const [query, setQuery] = useState('')`.
    - `BoardSidebar filters={<FilterPanel value={filter} onChange={setFilter} users={...} />}`
    - `BoardPage` takes `filter`, `query`, `onQueryChange`; renders `<SearchBox value={query} onChange={...} onClear={...} />` in `toolbar`; passes `cards={filterCards(cards, filter, query)}` to `BoardView`.
  - ✅ **No** `filteredCards` state — filter directly during render. Filters + search combine correctly; "Clear filters" works.
  - 📖 [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components), [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure)

- [x] **T1.4 — Snapshots & batching**
  - 📁 Edit `cardUtils.ts`, `BoardPage.tsx`.
  - ✍️ `nextPriority(p: Priority): Priority` — `low → medium → high → urgent`, `urgent` stays put.
  - ✍️ In `BoardPage`: `bumpOnce(id)` raises it 1 level; `handleBump(id)` calls `bumpOnce(id)` **twice** (the ⏫ button should raise it 2 levels).
  - 📋 Wrong version: `bumpOnce` uses `setCards(cards.map(...))` → a click only raises it 1 level. Add `console.log(cards)` right after `setCards`. Correct version: `setCards(prev => prev.map(...))`.
  - 🧩 `getCardProps → onBumpPriority`.
  - ✅ Correct version: one click turns `low` into `high`. A comment in the code explains why the wrong version only raises 1 level and why the log prints the old value.
  - 📖 [State as a Snapshot](https://react.dev/learn/state-as-a-snapshot), [Queueing a Series of State Updates](https://react.dev/learn/queueing-a-series-of-state-updates)

- [x] **T1.5 — Multiple boards: preserving & resetting state**
  - 📁 Edit `App.tsx`, `BoardPage.tsx`.
  - 📋
    - `App`: `const [activeBoardId, setActiveBoardId] = useState(sampleBoards[0].id)`, pass `onSelectBoard` to `BoardSidebar`.
    - **Move the `cards` state from `BoardPage` up to `App`** (both boards share one card list). `BoardPage` gets `cards` + the update functions through props.
    - Render `<BoardPage key={activeBoardId} ... />` → local state (`editingCardId`, `isCreateOpen`, a half-typed form) resets when switching boards, while `cards` is kept.
    - Experiment: remove the `key` → open the form, type something, switch boards → the form is still there. Try declaring a component **inside** `BoardPage` → its state is lost on every render.
  - ✅ Switching boards: the right board's cards, the form/title editing is reset, cards added/deleted on the other board are kept.
  - 📖 [Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state)

- [x] **T1.6 — `useReducer`**
  - 📁 Create `src/features/boards/boardReducer.ts`. Edit `App.tsx`, `BoardPage.tsx`.
  - ✍️
    ```ts
    export type BoardAction =
      | { type: 'added'; card: Card }
      | { type: 'deleted'; id: string }
      | { type: 'renamed'; id: string; title: string }
      | { type: 'moved'; id: string; toColumnId: ColumnId }
      | { type: 'priorityBumped'; id: string }
    export function boardReducer(cards: Card[], action: BoardAction): Card[]
    ```
  - 📋 `App`: `const [cards, dispatch] = useReducer(boardReducer, sampleCards)`. `BoardPage` only calls `dispatch(...)`. The reducer reuses `nextColumnId`, `nextOrder`, `nextPriority`. The `switch` has a `default` branch with an exhaustive check: `const _exhaustive: never = action`.
  - ✅ No `setCards` left. The reducer is pure (no `Math.random`, no `Date.now`, no API calls) — ids/creation dates are generated outside before dispatching.
  - 📖 [Extracting State Logic into a Reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer), [`useReducer`](https://react.dev/reference/react/useReducer)

---

## Level 2 — Effects, Refs, Custom Hooks

From here on, run `npm run api` alongside `npm run dev`. Remove `src/data/sample.ts` from App.

- [x] **T2.1 — Calling the API with `useEffect`**
  - 📁 Create `src/api/boards.ts`, `src/api/cards.ts`, `src/api/comments.ts`. Edit `App.tsx`, `BoardPage.tsx`, `boardReducer.ts`.
  - ✍️ API (all use `request()`; GET functions take `signal?: AbortSignal`):
    - `getBoards(signal?): Promise<Board[]>`, `getUsers(signal?): Promise<User[]>`
    - `getCards(boardId: string, signal?): Promise<Card[]>`
    - `createCard(input: Omit<Card, 'id'>): Promise<Card>`, `updateCard(id: string, patch: Partial<Card>): Promise<Card>` (PATCH), `deleteCard(id: string): Promise<void>`
    - `getComments(cardId: string, signal?): Promise<Comment[]>`, `addComment(input: Omit<Comment, 'id'>): Promise<Comment>`
  - ✍️ Add the actions `{ type: 'loaded'; boardId: string; cards: Card[] }` (replaces that board's cards) and `{ type: 'replaced'; card: Card }`.
  - 📋
    - `App` loads boards + users once on mount. Error → `ErrorMessage` with `onRetry`.
    - `BoardPage` loads cards whenever `board.id` changes: state `status: 'loading' | 'error' | 'ready'`, `error: unknown`; use an `AbortController` in the cleanup to cancel the old request. The "Retry" button bumps a `reloadKey` state (included in the deps).
    - Writes (create/delete/move/rename): **wait for the API to succeed before dispatching** (pessimistic). While waiting, the submit button is `loading`.
  - 🧩 `BoardSkeleton`, `ErrorMessage`, `Button loading`.
  - ✅ With `VITE_API_DELAY=2000` in `.env.local`, switching boards rapidly → never shows the old board's cards by mistake. After a refresh the data is still there (saved to `db.json`).
  - 📖 [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects), [Lifecycle of Reactive Effects](https://react.dev/learn/lifecycle-of-reactive-effects), [Fetching data](https://react.dev/reference/react/useEffect#fetching-data-with-effects)

- [x] **T2.2 — Removing unnecessary effects**
  - 📋 Write it wrong on purpose, then fix it, with a "before/after" comment for each case:
    1. `const [visible, setVisible] = useState([]); useEffect(() => setVisible(filterCards(...)), [cards, filter, query])` → put a `RenderCounter` next to it to see the extra renders → change it to compute during render.
    2. `useEffect(() => { setEditingCardId(null) }, [board.id])` → replace with `key` (already done in T1.5).
    3. Sending `deleteCard` from inside an effect based on a `pendingDeleteId` state → move it into the event handler.
  - ✅ `BoardPage` only has effects for syncing with the outside world (fetching).
  - 📖 [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)

- [x] **T2.3 — `useRef`**
  - 📁 Edit `CreateCardForm.tsx`, `App.tsx` (or wherever `query` lives), `BoardPage.tsx`.
  - 📋
    - (a) Auto focus: `const titleRef = useRef<HTMLInputElement>(null)` → `CardFormFields titleRef={titleRef}`; focus it in a `useEffect` when the form mounts (no `autoFocus`).
    - (b) Debounce the search by 300ms: keep `SearchBox` **uncontrolled** (`defaultValue`); `onChange` sets a `setTimeout` whose id is stored in `timerRef`, cancels the old timer before setting a new one, and clears it on unmount. `query` only updates after typing stops for 300ms. The ✕ button clears the input via `inputRef.current.value = ''`.
    - (c) Count `BoardPage` renders: `renderCount = useRef(0)`, incremented every render, shown with `<RenderCounter count={...} />` in `toolbar`.
  - ✅ All 3 features work. A comment explains why (c) can't be state, and why the count goes up by 2 in StrictMode.
  - 📖 [Referencing Values with Refs](https://react.dev/learn/referencing-values-with-refs), [Manipulating the DOM with Refs](https://react.dev/learn/manipulating-the-dom-with-refs)

- [x] **T2.4 — Custom hooks**
  - 📁 `src/hooks/useFetch.ts`, `useDebouncedValue.ts`, `useLocalStorage.ts`, `useKeyboardShortcut.ts`.
  - ✍️
    - `useFetch<T>(load: (signal: AbortSignal) => Promise<T>, deps: unknown[]): { data: T | undefined; error: unknown; loading: boolean; reload: () => void }`
    - `useDebouncedValue<T>(value: T, delayMs: number): T`
    - `useLocalStorage<T>(key: string, initial: T): [T, (next: T | ((prev: T) => T)) => void]` — lazy init, fall back to `initial` when JSON parsing fails, `try/catch` around writes.
    - `useKeyboardShortcut(key: string, handler: (e: KeyboardEvent) => void, options?: { enabled?: boolean })` — ignored while typing in an input/textarea.
  - 📋 Apply them: `useFetch` for boards/users/cards; `useDebouncedValue` replaces the hand-rolled timer from T2.3b (SearchBox goes back to controlled); `useLocalStorage` remembers `filter` and `activeBoardId`; the `/` key focuses the search box, the `n` key opens the create-card form.
  - ✅ Components get noticeably shorter; `npm run lint` has no `exhaustive-deps` warnings.
  - 📖 [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks), [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)

- [x] **T2.5 — `useLayoutEffect`: card description tooltip**
  - 📁 `src/features/cards/tooltipPosition.ts`, `src/features/cards/CardTooltip.tsx`. Edit `BoardPage.tsx`.
  - ✍️ `computeTooltipPosition(anchor: DOMRect, size: { width: number; height: number }, viewport: { width: number; height: number }, gap = 8): { top: number; left: number }` — by default **below** the card, left-aligned; overflows the bottom → flip above; overflows the right → shift left; never < 8px from an edge.
  - ✍️ `CardTooltip({ anchor, text }: { anchor: DOMRect; text: string })` — renders `TooltipBox` at a temporary position; `useLayoutEffect` measures `ref.current.getBoundingClientRect()` and then sets the real position.
  - 📋 `BoardPage`: state `hovered: { text: string; rect: DOMRect } | null`; wired up via `getCardProps → articleProps.onMouseEnter/onMouseLeave` (`e.currentTarget.getBoundingClientRect()`). Cards without a description show nothing.
  - ✅ Do it with `useEffect` first (you'll see it flash in the wrong spot), switch to `useLayoutEffect` and the flash is gone. The tooltip doesn't overflow the screen for a card in the bottom-right corner.
  - 📖 [`useLayoutEffect`](https://react.dev/reference/react/useLayoutEffect)

- [x] **T2.6 — `useSyncExternalStore`**
  - 📁 `src/hooks/useOnlineStatus.ts`, `src/hooks/useMediaQuery.ts`. Edit `App.tsx`, `BoardPage.tsx`.
  - ✍️ `useOnlineStatus(): boolean` (the `online`/`offline` events), `useMediaQuery(query: string): boolean` (`matchMedia(...).addEventListener('change', ...)`). Both use `useSyncExternalStore` with a `getServerSnapshot`.
  - 📋 Offline → `Layout banner={<Banner tone="warning">You're offline…</Banner>}`. Screen ≤ 768px → don't render the `sidebar`; instead a "Filters" button in `toolbar` opens `FilterPanel` in a `Modal`.
  - ✅ DevTools → Network → Offline shows the banner; shrinking the window shows the Filters button. No `useState` + `useEffect` in the 2 hooks.
  - 📖 [`useSyncExternalStore`](https://react.dev/reference/react/useSyncExternalStore)

- [x] **T2.7 — `useEffectEvent`**
  - 📁 Edit `BoardPage.tsx`.
  - 📋 Whenever a board opens (`board.id` changes), log `console.info('[analytics] open board', board.id, { visibleCount })` where `visibleCount` = the number of cards shown after filtering. Changing filters/search must **not** log again, but the log must have the latest `visibleCount`. Use `const onOpen = useEffectEvent(...)`.
  - ✅ Changing the filter: no log. Changing the board: exactly 1 log in production (`npm run build && npm run preview`); dev StrictMode may log 2 — a comment explains why.
  - 📖 [Separating Events from Effects](https://react.dev/learn/separating-events-from-effects), [`useEffectEvent`](https://react.dev/reference/react/useEffectEvent)

---

## Level 3 — Router, Context, Architecture

- [x] **T3.1 — Routing**
  - 📁 Create `src/app/router.tsx`, `src/app/RootLayout.tsx`, `src/features/cards/CardDetailRoute.tsx`, `src/hooks/useFilterParams.ts`. Edit `main.tsx`/`App.tsx`, `BoardPage.tsx`, `BoardSidebar.tsx` (turn the `<button>`s into `<NavLink className="board-sidebar__item">`).
  - 📋 Routes (`react-router` is already installed):
    | Path | Element |
    | --- | --- |
    | `/` | `<Navigate to="/boards" />` |
    | `/boards` | redirect to the first board, or `EmptyState` if there are none |
    | `/boards/:boardId` | `BoardPage` (reads `useParams`) |
    | `/boards/:boardId/cards/:cardId` | a **child route** of the board: `CardDetailRoute` = `Modal` + `CardDetail` shown **on top of** the board (BoardPage renders `<Outlet />`) |
    | `/stats`, `/settings` | `StatsPage`, `SettingsPage` (an empty `PageHeader` for now) |
    | `*` | `NotFoundView` + `<Link to="/boards">` |
  - 📋 `RootLayout` uses `Layout` with `nav` = 3 `<NavLink className="layout__nav-link">` (Boards, Stats, Settings) + `<Outlet />`.
  - ✍️ `useFilterParams(): [{ filter: CardFilter; query: string }, (next: Partial<{ filter: CardFilter; query: string }>) => void]` — reads/writes `?label=bug&label=docs&priority=high&assignee=u1&q=login` with `useSearchParams`. Replaces the filter's state/localStorage.
  - 📋 `CardItem onOpen` → `navigate(\`cards/${card.id}\`)`; closing the modal → `navigate('..')` keeping the search params. A `cardId` that doesn't exist → `NotFoundView` inside the modal.
  - ✅ Refreshing on `/boards/b1/cards/c1?label=bug` still opens the right card with the right filters. The browser's Back/Forward work.
  - 📖 [React Router](https://reactrouter.com/home)

- [x] **T3.2 — Context: Theme & Auth**
  - 📁 `src/context/ThemeContext.tsx`, `src/context/AuthContext.tsx`, `src/features/auth/LoginPage.tsx`, `src/features/auth/RequireAuth.tsx`, `src/features/settings/SettingsPage.tsx`.
  - ✍️
    - `ThemeProvider({ children })`; `useTheme(): { theme: Theme; setTheme(t: Theme): void; toggleTheme(): void }` — throws if used outside the Provider. Persisted with `useLocalStorage`; an effect sets `document.documentElement.dataset.theme`. Defaults to `prefers-color-scheme`.
    - `AuthProvider({ children })`; `useAuth(): { user: User | null; login(user: User): void; logout(): void }` — keeps the user in localStorage.
    - `RequireAuth({ children })` — not signed in → `<Navigate to="/login" state={{ from: location }} replace />`.
    - `LoginPage` — `LoginView` + `getUsers()`; after signing in, go back to the `from` page.
    - `SettingsPage` — `SettingsView` with `useTheme()` + `useAuth()`.
  - 📋 Header: `headerActions={<><ThemeToggle .../><UserMenu .../></>}`. New comments use `user.id` as `authorId`. Write the Providers the React 19 way: `<ThemeContext value={...}>`.
  - ✅ `theme`/`user` are never passed through props anywhere (except into UI components).
  - 📖 [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context), [`createContext`](https://react.dev/reference/react/createContext)

- [x] **T3.3 — Context + Reducer**
  - 📁 `src/context/BoardContext.tsx`. Edit `App`/`RootLayout`, `BoardPage.tsx`.
  - ✍️
    - `BoardProvider({ children })` — `useReducer(boardReducer, [])`, loads `boards`, `users`.
    - `BoardStateContext` holds `{ boards: Board[]; users: User[]; usersById: Record<string, User>; cards: Card[] }`; `BoardDispatchContext` holds `dispatch`.
    - `useBoardState()`, `useBoardDispatch()` — throw outside the Provider.
    - (optional) `useCardActions()` returns `{ create, remove, move, rename }` wrapping "call the API + dispatch".
  - 📋 Remove every `cards`/`dispatch`/`users` prop that's passed through layers.
  - ✅ Put a `RenderCounter` in a component that only uses `useBoardDispatch()` → it does **not** re-render when cards change (compared to a single merged context).
  - 📖 [Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context)

- [x] **T3.4 — Portals + Modal behaviour**
  - 📁 Edit `src/components/ui/Modal.tsx`.
  - 📋 `createPortal(..., document.body)`; Esc → `onClose` (a `keydown` listener in an effect, with cleanup); clicking the backdrop → `onClose`, but clicking inside the panel doesn't (`e.target === e.currentTarget`); lock scrolling with `document.body.style.overflow = 'hidden'` while open, restoring the old value on close.
  - 📋 Experiment: put `onClick={() => console.log('bubble')}` on a `div` wrapping the `Modal` in `BoardPage` → clicking inside the modal still logs even though the modal's DOM is in `body`. Add a comment explaining why.
  - ✅ The card detail modal (T3.1) and the create-card form both have all of the above. 2 nested modals (delete confirmation inside card detail) — Esc only closes the top one.
  - 📖 [`createPortal`](https://react.dev/reference/react-dom/createPortal)

- [x] **T3.5 — Ref as a prop & `useImperativeHandle`**
  - 📁 `src/components/ConfirmDialog.tsx`. Edit `BoardPage.tsx`, `CardDetailRoute.tsx`.
  - ✍️
    ```ts
    export interface ConfirmDialogHandle {
      open(message: string, options?: { confirmText?: string; danger?: boolean }): Promise<boolean>
    }
    export function ConfirmDialog({ ref }: { ref: Ref<ConfirmDialogHandle> })
    ```
    Inside: state `{ open, message, options }`, the Promise's `resolve` kept in a `useRef`, `useImperativeHandle(ref, () => ({ open }))`, renders `ConfirmDialogView`.
  - 📋 Deleting a card: `if (await confirmRef.current?.open(\`Delete "${card.title}"?\`, { danger: true })) remove(card.id)`.
  - 📋 Re-read `Field.tsx`: `ref` reaches the `<input>` through `...rest` without `forwardRef` — add a comment explaining why (React 19).
  - ✅ Cancel → nothing is deleted; OK → deleted; closing with Esc = cancel.
  - 📖 [`useImperativeHandle`](https://react.dev/reference/react/useImperativeHandle), [ref as a prop](https://react.dev/blog/2024/12/05/react-19#ref-as-a-prop)

- [x] **T3.6 — `useId`**
  - 📁 Edit `src/components/ui/Field.tsx`, `CardFormFields.tsx`.
  - 📋 Make the `id` of `TextField`, `TextAreaField`, `SelectField`, `CheckboxGroup` **optional**: when it isn't passed, use `useId()`. Remove the `idPrefix` prop from `CardFormFields`.
  - ✅ With the create-card form and another `CardFormFields` (e.g. in the Gallery) open at the same time → running `[...document.querySelectorAll('[id]')].map(e => e.id)` in the console shows no duplicate ids; clicking a label still focuses the right field.
  - 📖 [`useId`](https://react.dev/reference/react/useId)

- [x] **T3.7 — Error Boundaries**
  - 📁 `src/components/ErrorBoundary.tsx`. Edit `BoardView.tsx` (wrap each `Column`), `RootLayout.tsx` (wrap the `Outlet`).
  - ✍️
    ```ts
    interface ErrorBoundaryProps {
      fallback: (error: unknown, reset: () => void) => ReactNode
      resetKeys?: unknown[] // changing a value → resets automatically
      children: ReactNode
    }
    class ErrorBoundary extends Component<ErrorBoundaryProps, { error: unknown }>
    ```
    With `static getDerivedStateFromError`, `componentDidCatch` (logging), and `componentDidUpdate` comparing `resetKeys`.
  - 📋 Trigger an error: in `BoardPage`'s `getCardProps`, if `card.title.includes('💣')` then `throw new Error('Bomb card!')` (this function runs while Column renders). Create a card titled "💣".
  - 🧩 `ErrorMessage compact` as the column fallback; `ErrorMessage` as the page fallback.
  - ✅ Only the column holding the bomb card shows an error; the other 2 columns keep working; "Retry" after deleting the bomb card (via the API/db.json) brings the column back. Comment: errors in event handlers/async code are **not** caught by the boundary — try it to see.
  - 📖 [Catching rendering errors with an Error Boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)

---

## Level 4 — React 19: Suspense, Actions, new Hooks

- [x] **T4.1 — `lazy` + `Suspense`**
  - 📁 Edit `router.tsx`, `RootLayout.tsx`.
  - 📋 `const StatsPage = lazy(() => import('../features/stats/StatsPage'))`, same for `SettingsPage` (the file must `export default`). `<Suspense fallback={<PageSkeleton />}>` wraps the `Outlet`.
  - ✅ `npm run build` produces separate chunks for the 2 pages; the Network tab only loads a chunk when its page opens.
  - 📖 [`lazy`](https://react.dev/reference/react/lazy), [`<Suspense>`](https://react.dev/reference/react/Suspense)

- [x] **T4.2 — `use()` to read comments**
  - 📁 `src/api/commentsCache.ts`, `src/features/cards/CommentsSection.tsx`. Edit `CardDetailRoute.tsx`.
  - ✍️
    - `getCommentsPromise(cardId: string): Promise<Comment[]>` — cached in a `Map<string, Promise<Comment[]>>`; `invalidateComments(cardId: string): void`.
    - `CommentsSection({ cardId })` = `ErrorBoundary` › `Suspense fallback={<CommentListSkeleton />}` › `Comments({ promise })`.
    - `Comments({ promise })`: `const comments = use(promise)`; only when `comments.length > 0` do `const { usersById } = use(BoardStateContext)` (calling `use` inside an `if` — something other hooks aren't allowed to do).
  - 📋 Experiment: create a new promise every render (`use(getComments(cardId))` without a cache) → you'll see requests looping forever in Network. Add a comment.
  - 🧩 `CardDetail children={<CommentsSection … />}`, `CommentList`.
  - ✅ Reopening a card you've seen → the comments show immediately, no skeleton.
  - 📖 [`use`](https://react.dev/reference/react/use)

- [x] **T4.3 — Form Actions + `useActionState`**
  - 📁 Rewrite `CreateCardForm.tsx`.
  - ✍️
    ```ts
    type CreateCardState = { errors?: CardFormErrors; values?: Partial<CardFormValues>; createdId?: string }
    async function createCardAction(prev: CreateCardState, formData: FormData): Promise<CreateCardState>
    const [state, formAction, isPending] = useActionState(createCardAction, {})
    ```
  - 📋 `<form action={formAction}>`; the action: `readCardForm` → `validateCardForm` → on errors return `{ errors, values }` → if valid, `await createCard(...)`, `dispatch({ type: 'added' })`, return `{ createdId }`. API errors → `errors.form`, shown with `FormMessage`. On errors pass `defaultValues={state.values}` so typed data isn't lost (the form resets itself after every action). Success → close the modal.
  - ✅ No more `onSubmit`, `preventDefault`, or hand-rolled loading state. Set `VITE_API_FAIL_RATE=1` to try server errors.
  - 📖 [`useActionState`](https://react.dev/reference/react/useActionState), [`<form>`](https://react.dev/reference/react-dom/components/form)

- [x] **T4.4 — `useFormStatus`**
  - 📁 `src/components/SubmitButton.tsx`.
  - ✍️ `SubmitButton({ children, pendingText = 'Saving…' })` — `const { pending } = useFormStatus()` → `<Button type="submit" variant="primary" loading={pending}>`.
  - 📋 Use it in `CreateCardForm` and the comment form (`CommentComposerFields submit={<SubmitButton>Send</SubmitButton>}`). Try calling `useFormStatus` in the component that renders the `<form>` → always `false`; add a comment explaining why.
  - ✅ No `loading`/`isPending` prop is passed down to the button.
  - 📖 [`useFormStatus`](https://react.dev/reference/react-dom/hooks/useFormStatus)

- [x] **T4.5 — `useOptimistic` + Toasts**
  - 📁 `src/context/ToastContext.tsx`. Edit `BoardPage.tsx`, `CommentsSection.tsx`.
  - ✍️ `ToastProvider`, `useToast(): { show(kind: ToastItem['kind'], message: string): void }` — auto-hides after 4s (the timer has a cleanup), renders `ToastStack`.
  - ✍️ Board:
    ```ts
    const [optimisticCards, moveOptimistic] = useOptimistic(cards, (state, m: { id: string; toColumnId: ColumnId }) => ...)
    function handleDropCard(cardId: string, toColumnId: ColumnId) {
      startTransition(async () => { moveOptimistic(...); try { await updateCard(...); dispatch(...) } catch { toast.show('error', '...') } })
    }
    ```
    Pass `onDropCard={handleDropCard}` to `BoardView`; the ←/→ buttons share it too. Cards waiting on the server: `isPending` (compare `optimisticCards` with `cards`).
  - ✍️ Comments: `useOptimistic(comments, (state, c: CommentView) => [...state, { ...c, pending: true }])`; once sent, `invalidateComments` + refresh the promise.
  - ✅ `VITE_API_DELAY=2000`: drag and drop moves the card to the new column immediately, dimmed until it's done. `VITE_API_FAIL_RATE=0.5`: on error the card snaps back + a red toast.
  - 📖 [`useOptimistic`](https://react.dev/reference/react/useOptimistic)

- [x] **T4.6 — `useTransition`**
  - 📁 `src/api/cardsCache.ts`. Edit `BoardPage.tsx`, `RootLayout.tsx`.
  - 📋 Move card loading to Suspense: `getCardsPromise(boardId)` with a cache (like T4.2), `BoardPage` reads it with `use()`, wrapped in `Suspense fallback={<BoardSkeleton />}`. Add `Tabs` above the board (`items` = the boards) — `onSelect` calls `startTransition(() => navigate(...))`, `pendingId` = the board being switched to while `isPending`, `BoardView isStale={isPending}`.
  - ✅ Compare: switching boards from the sidebar (no transition) → the skeleton flashes; with the Tabs → the old board dims, then switches. A comment explains why.
  - 📖 [`useTransition`](https://react.dev/reference/react/useTransition)

- [x] **T4.7 — `useDeferredValue`**
  - 📁 `src/features/stats/StatsPage.tsx`, `src/features/stats/SearchResults.tsx`, add `getAllCards()` to `src/api/cards.ts`.
  - 📋 Run `npm run api:big`. `StatsPage`: `SearchBox` (controlled, **no debounce**) + `SearchResults({ cards, query, usersById })` wrapped in `memo`, rendering **every** result as a `CardRow` inside `ListFrame height={480} count={...}`.
    - Step 1: typing feels janky.
    - Step 2: `const deferredQuery = useDeferredValue(query)`; pass `deferredQuery` to `SearchResults`; `isStale = query !== deferredQuery` → `ListFrame isStale`, `SearchBox busy`.
  - ✅ Typing is smooth; the list dims while it's being computed. Comment: how is this different from debounce (T2.4)?
  - 📖 [`useDeferredValue`](https://react.dev/reference/react/useDeferredValue)

- [x] **T4.8 — `<Activity>`**
  - 📁 Edit `StatsPage.tsx`.
  - 📋 Split the Stats page into 3 tabs (`Tabs`): "Overview" (`StatsOverview`, using numbers from a simple loop for now), "Search" (T4.7), "Profiler" (T5.2). Wrap each tab in `<Activity mode={tab === id ? 'visible' : 'hidden'}>`.
  - ✅ Type a search + scroll down, switch to another tab and back → everything is still there. Add a `useEffect` with a mount/cleanup `console.log` in the Search tab to see the effect cleaned up while hidden. Compare with `{tab === 'search' && ...}`.
  - 📖 [`<Activity>`](https://react.dev/reference/react/Activity)

- [x] **T4.9 — Metadata & resources**
  - 📋 Render `<title>` + `<meta name="description">` right inside `BoardPage` (`"{board.title} · TaskFlow"`), `StatsPage`, `SettingsPage`, `LoginPage`. Call `preconnect(API_URL)` in `RootLayout`.
  - ✅ The browser tab title follows the page.
  - 📖 [`<title>`](https://react.dev/reference/react-dom/components/title), [`preconnect`](https://react.dev/reference/react-dom/preconnect)

---

## Level 5 — Performance & the React Profiler

Run `npm run api:big`. Record every measurement in `PERF.md`. **Measure first → fix → measure again.**

- [ ] **T5.1 — React DevTools Profiler (baseline)**
  - 📋 Install the React Developer Tools extension. In the Profiler tab's settings, turn on "Record why each component rendered"; in Components, turn on "Highlight updates". Record a profile of 3 scenarios: typing 5 characters in Stats › Search; dragging 1 card on the board; toggling the theme.
  - ✅ A baseline table in `PERF.md` + the 3 most expensive components (Ranked chart) + why they rendered.
  - 📖 [React Developer Tools](https://react.dev/learn/react-developer-tools), [Introducing the React Profiler](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)

- [x] **T5.2 — The `<Profiler>` API**
  - 📁 `src/features/stats/profilerStore.ts`, edit `StatsPage.tsx`, `BoardPage.tsx`.
  - ✍️ `profilerStore.ts`: `record(row: ProfilerRow)` (keeps the 20 latest rows), `clear()`, `subscribe(listener)`, `getSnapshot()`; a `useProfilerRows(): ProfilerRow[]` hook via `useSyncExternalStore`. An `onRender: ProfilerOnRenderCallback` function calls `record`.
  - 📋 Wrap `<Profiler id="SearchResults" onRender={onRender}>` and `<Profiler id="BoardView" ...>`. The "Profiler" tab shows `ProfilerTable rows={useProfilerRows()} onClear={clear}`.
  - ⚠️ Why **not** use `useState` in `onRender`? (try it → a render loop). Add a comment.
  - ✅ The table updates as you interact. A comment explains `actualDuration` vs `baseDuration`.
  - 📖 [`<Profiler>`](https://react.dev/reference/react/Profiler)

- [ ] **T5.3 — `memo`, `useMemo`, `useCallback`**
  - 📁 `src/features/stats/computeStats.ts`, plus the components the Profiler points to.
  - ✍️ `computeBoardStats(cards: Card[], today: string): BoardStats` — replaces the temporary numbers from T4.8; wrapped in `useMemo`.
  - 📋 Fix exactly the 3 hot spots from T5.1. Two experiments where memo is **useless**: pass a new `style={{...}}` every render into a `memo` component; pass JSX `children` into a `memo` component.
  - ✅ `PERF.md` has before/after numbers for each change + an explanation of the 2 experiments.
  - 📖 [`memo`](https://react.dev/reference/react/memo), [`useMemo`](https://react.dev/reference/react/useMemo), [`useCallback`](https://react.dev/reference/react/useCallback)

- [ ] **T5.4 — Fix the structure instead of memoizing**
  - 📋 Without memo: (a) move the `query` state down into the smallest component that needs it; (b) pass the heavy part through `children` so it doesn't re-render; (c) check whether a theme change in `ThemeContext` drags the whole board into re-rendering, and split it if needed.
  - ✅ At least 1 place where memo was removed and it's just as fast — with numbers.
  - 📖 [Before you memo()](https://overreacted.io/before-you-memo/)

- [x] **T5.5 — Virtualization**
  - 📁 `src/components/VirtualList.tsx`.
  - ✍️
    ```ts
    interface VirtualListProps<T> {
      items: T[]
      itemHeight: number // use CARD_ROW_HEIGHT
      height: number
      overscan?: number // defaults to 5
      renderItem: (item: T, index: number, style: CSSProperties) => ReactNode
    }
    ```
    Use `ListFrame` (`ref`, `onScroll`); a `scrollTop` state; compute `startIndex`, `endIndex`; an inner div `items.length * itemHeight` tall; each item `position: absolute; top: index * itemHeight`.
  - 📋 Replace the list in `SearchResults`. Then try `@tanstack/react-virtual` and compare.
  - ✅ The DOM inside `ListFrame` has < 100 nodes even with 5,000 results; before/after mount numbers in `PERF.md`.
  - 📖 [TanStack Virtual](https://tanstack.com/virtual/latest)

- [ ] **T5.6 — Chrome Performance + React tracks**
  - 📋 Chrome DevTools › Performance: record typing a search with and without `useDeferredValue`. Find the "Scheduler ⚛" and "Components ⚛" tracks.
  - ✅ Screenshots of the 2 recordings + notes (Blocking vs Transition lane, long tasks) in `PERF.md`.
  - 📖 [React Performance Tracks](https://react.dev/reference/dev-tools/react-performance-tracks)

- [ ] **T5.7 — React Compiler**
  - 📋 Turn on the React Compiler for Vite following the official guide (copy the project into another folder to experiment). Remove the hand-written `memo`/`useMemo`/`useCallback`, profile again, and compare with T5.3. Look for the "Memo ✨" badge in DevTools.
  - ✅ `PERF.md` has numbers + a conclusion on where (if anywhere) to keep manual memoization.
  - 📖 [React Compiler](https://react.dev/learn/react-compiler), [Rules of React](https://react.dev/reference/rules)

---

## Level 6 — Quality

- [x] **T6.1 — Testing**
  - 📁 Tests live next to their file: `xxx.test.ts(x)`.
  - 📋 At minimum:
    - `boardReducer.test.ts` — every action, including not mutating the old state.
    - `filterCards.test.ts`, `cardForm.test.ts`, `tooltipPosition.test.ts`, `computeStats.test.ts`, `src/utils/date.test.ts`.
    - `useDebouncedValue.test.ts` — `renderHook` + `vi.useFakeTimers()`.
    - `CreateCardForm.test.tsx` — `userEvent` types, submits, sees errors; mock `fetch` (`vi.spyOn(globalThis, 'fetch')`) to test a successful create. Set `VITE_API_DELAY=0` for tests (`vite.config.ts › test.env`).
  - ✅ `npm test` is green, ≥ 20 tests. Query by role/label, not by class.
  - 📖 [Testing Library](https://testing-library.com/docs/react-testing-library/intro), [Vitest](https://vitest.dev/guide/)

- [x] **T6.2 — StrictMode**
  - 📋 Go over every effect/subscription: which write requests get sent twice? Which listeners get registered twice? Which timers are never cleared? Fix them with proper cleanup.
  - ✅ A list of the problems found + how they were fixed, in comments or notes.
  - 📖 [`<StrictMode>`](https://react.dev/reference/react/StrictMode)

- [x] **T6.3 — Accessibility**
  - 📁 Edit `BoardPage.tsx`, `Modal.tsx`.
  - 📋
    - Cards are focusable: `articleProps={{ tabIndex: 0, onKeyDown }}`; `ArrowLeft/ArrowRight` move columns, `Enter` opens the detail, `Delete` deletes (with confirmation). After moving columns, focus follows the card.
    - Modal: focus the first element on open, Tab/Shift+Tab can't escape, and closing returns focus to the element that opened the modal.
    - A hidden `aria-live="polite"` region (a hand-written `sr-only` class) announces "Moved … to In progress".
  - ✅ The whole app can be used without a mouse.
  - 📖 [Accessibility (MDN)](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility)

---

## Level 7 — Next.js App Router & Server Components

```bash
npx create-next-app@latest taskflow-next --ts --app --eslint --src-dir
```

Copy into the new project: `src/types.ts`, `src/components/`, `src/features/**/…View.tsx` + the UI components + CSS. json-server still runs from `taskflow/` (`npm run api`).

- [ ] **T7.1 — Port the UI**
  - 📋 `app/layout.tsx` uses `Layout`; `app/boards/[boardId]/page.tsx` renders `BoardView` with data fetched on the server. Components that use hooks/events (`Column`, `Modal`, `SearchBox`…) need `'use client'` at the top of the file.
  - ✅ The board shows the right data.
  - 📖 [Next.js App Router](https://nextjs.org/docs/app)

- [ ] **T7.2 — Server vs Client Components**
  - 📋 `page.tsx` is an `async` component doing `await fetch('http://localhost:3001/...')`. Split out a `BoardClient` (`'use client'`) holding search/drag and drop. Pass a Server Component as the `children` of a Client Component.
  - ✅ A component tree diagram marking Server/Client in the README; check that the client bundle doesn't contain the fetching code.
  - 📖 [Server Components](https://react.dev/reference/rsc/server-components), [`'use client'`](https://react.dev/reference/rsc/use-client)

- [ ] **T7.3 — Server Functions**
  - 📋 `app/actions.ts` with `'use server'`: `createCard(prev, formData)`, `moveCard(cardId, toColumnId)`, `addComment(prev, formData)`; call `revalidatePath`. Reuse `useActionState`, `useOptimistic`, `SubmitButton` from Level 4.
  - ✅ Cards can still be created with JavaScript disabled in DevTools.
  - 📖 [Server Functions](https://react.dev/reference/rsc/server-functions), [`'use server'`](https://react.dev/reference/rsc/use-server)

- [ ] **T7.4 — Streaming**
  - 📋 `loading.tsx` (uses `BoardSkeleton`), `error.tsx` (uses `ErrorMessage`), `not-found.tsx` (uses `NotFoundView`); a separate `<Suspense>` for the stats section (deliberately 3s slow).
  - ✅ The page shell shows immediately, and the slow part "streams" in afterwards.
  - 📖 [loading.js](https://nextjs.org/docs/app/api-reference/file-conventions/loading)

- [ ] **T7.5 — Promises from Server to Client**
  - 📋 A Server Component calls `getComments(cardId)` **without awaiting**, and passes the promise to a Client Component that reads it with `use()` inside `<Suspense fallback={<CommentListSkeleton />}>`.
  - ✅ A comment explains the difference from T4.2 (who creates the promise, where it's cached).
  - 📖 [`use` — streaming data from server to client](https://react.dev/reference/react/use#streaming-data-from-server-to-client)

---

🎓 **Done:** check against `CONCEPTS.md` — once every line is ticked, you've been through almost all of modern React.
