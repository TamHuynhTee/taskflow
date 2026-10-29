# TaskFlow — Lộ trình học React

App quản lý công việc kiểu Trello mini. **Toàn bộ giao diện (component hiển thị + CSS) đã có sẵn** —
bạn chỉ viết phần logic: state, hooks, effect, context, router, gọi API, tối ưu hiệu năng.
Làm lần lượt từ trên xuống; mỗi task xây tiếp trên code của task trước.
Xong task nào thì đánh `[x]`, rồi nhắn **"review T1.3"** để được review.

## Chạy project

```bash
npm install
npm run db:reset   # tạo db.json từ db.seed.json (chạy lại khi muốn khôi phục dữ liệu)
npm run dev        # app: http://localhost:5173 — UI mẫu: http://localhost:5173/#gallery
npm run api        # json-server: http://localhost:3001 (từ Level 2)
npm run api:big    # json-server với 5.000 card (Level 4.7, Level 5)
npm test           # Vitest
npm run lint       # oxlint (có rules-of-hooks + exhaustive-deps)
```

API json-server: `/boards`, `/cards`, `/comments`, `/users`. Lọc: `/cards?boardId=b1`, `/comments?cardId=c1`. Hỗ trợ `GET/POST/PUT/PATCH/DELETE`.
`src/api/client.ts` có sẵn hàm `request<T>(path, init)` với độ trễ + lỗi giả lập (chỉnh trong `.env.local`, xem `.env.example`).

## Quy ước

| Loại code | Đặt ở đâu | Ai viết |
| --- | --- | --- |
| Component hiển thị (chỉ nhận props, không gọi API) | `src/components/`, `src/features/*/…View.tsx`, `CardItem`, `Column`, `BoardView`… | ✅ có sẵn |
| Kiểu dữ liệu | `src/types.ts` | ✅ có sẵn |
| Hằng số & bảng tra | `src/features/cards/cardMeta.ts` (`EMPTY_FILTER`, `EMPTY_CARD_FORM`, `isPriority`, `isLabel`…) | ✅ có sẵn |
| **Component chứa logic** (state, effect, gọi API) — "container"/"page" | `src/features/*/…Page.tsx`, `…Form.tsx`, `src/app/` | ✍️ bạn |
| **Hàm thuần** (lọc, validate, tính toán) | cạnh feature, vd. `src/features/boards/filterCards.ts` | ✍️ bạn |
| **Custom hook** | `src/hooks/useXxx.ts` | ✍️ bạn |
| **Context** | `src/context/XxxContext.tsx` | ✍️ bạn |
| **Hàm gọi API** | `src/api/boards.ts`, `cards.ts`, `comments.ts` | ✍️ bạn |

Ký hiệu trong mỗi task:
📁 file cần tạo/sửa · ✍️ hàm/component phải viết (kèm chữ ký) · 📋 yêu cầu chi tiết · 🧩 UI có sẵn để dùng · ✅ tiêu chí xong · 📖 tài liệu nên đọc trước

## Bộ UI có sẵn

Mở **http://localhost:5173/#gallery** để xem tất cả đang chạy, và mở `src/dev/Gallery.tsx` để xem cách truyền props.

| Component | File | Props chính |
| --- | --- | --- |
| `Layout` | `components/Layout.tsx` | `sidebar`, `nav`, `headerActions`, `banner`, `children` |
| `ThemeToggle`, `UserMenu` | `components/HeaderWidgets.tsx` | `theme, onToggle` · `user, onLogout` |
| `Button`, `IconButton` | `components/ui/Button.tsx` | `variant`, `size`, `loading`, + mọi props của `<button>` |
| `TextField`, `TextAreaField`, `SelectField`, `CheckboxGroup` | `components/ui/Field.tsx` | `id`, `label`, `error`, `hint`, + props của input |
| `Modal`, `ConfirmDialogView` | `components/ui/Modal.tsx` | `open`, `title`, `onClose`, `footer` |
| `ErrorMessage`, `EmptyState`, `Banner`, `ToastStack`, `RenderCounter` | `components/ui/Feedback.tsx` | xem file |
| `Spinner`, `Skeleton`, `BoardSkeleton`, `CardSkeleton`, `PageSkeleton` | `components/ui/Spinner.tsx` | — |
| `Tabs`, `StatTile`, `PageHeader`, `TooltipBox` | `components/ui/Misc.tsx` | xem file |
| `BoardView` | `features/boards/BoardView.tsx` | `board, cards, users, today, toolbar, getCardProps, onDropCard, renderColumnFooter, isStale` |
| `Column` | `features/boards/Column.tsx` | (BoardView tự dùng) |
| `CardItem` | `features/cards/CardItem.tsx` | `onOpen, onDelete, onMove, onBumpPriority, onTitleDoubleClick, titleEditor, isPending, articleProps` |
| `BoardSidebar`, `FilterPanel`, `SearchBox`, `AddCardButton` | `features/boards/` | xem file |
| `InlineEdit` | `features/cards/InlineEdit.tsx` | `defaultValue, onCommit, onCancel` |
| `CardFormFields`, `FormActions`, `FormMessage` | `features/cards/CardFormFields.tsx` | `users, errors, values+onFieldChange` **hoặc** `defaultValues`, `titleRef` |
| `CardDetail` | `features/cards/CardDetail.tsx` | `card, board, assignee, today, actions, children` |
| `CommentList`, `CommentListSkeleton`, `CommentComposerFields` | `features/cards/CommentList.tsx` | `comments, usersById` · `submit` |
| `LoginView` | `features/auth/LoginView.tsx` | `users, onSelect, loading` |
| `SettingsView` | `features/settings/SettingsView.tsx` | `theme, onThemeChange, user, onLogout` |
| `StatsOverview`, `ProfilerTable`, `CardRow`, `ListFrame`, `CARD_ROW_HEIGHT` | `features/stats/StatsViews.tsx` | xem file |
| `NotFoundView` | `pages/NotFoundView.tsx` | `action` |

> Bạn được phép sửa file UI khi task yêu cầu (vd. T3.1 đổi nút trong `BoardSidebar` thành `NavLink`, T3.4 sửa `Modal`, T3.6 sửa `Field`). Ngoài ra cứ coi chúng là "thư viện".

---

## Level 0 — Nền tảng: JSX & Component ✅ (đã làm sẵn)

Đọc kỹ code mẫu (có comment giải thích) trước khi sang Level 1:
- `src/features/cards/CardItem.tsx` — props, conditional rendering, tra bảng `cardMeta.ts`
- `src/features/boards/Column.tsx` — list + `key` (có hướng dẫn thí nghiệm `key={index}`), trạng thái rỗng
- `src/features/boards/BoardView.tsx` — dữ liệu dẫn xuất tính trong render
- `src/components/Layout.tsx` — composition qua `sidebar` + `children`
- `src/utils/date.ts` — hàm thuần, `today` truyền vào thay vì gọi `new Date()` trong render

- [x] T0.1 `CardItem` tĩnh · [x] T0.2 Danh sách & `key` · [x] T0.3 Conditional rendering · [x] T0.4 Component thuần & composition

Tự thử: trong `Column.tsx` truyền `showNote` vào `CardItem` và đổi sang `key={index}` để thấy bug; thử gán `card.title = ...` trong `CardItem` để thấy vì sao không được mutate props.

---

## Level 1 — State & Sự kiện

Level 1 chưa gọi API: dữ liệu lấy từ `src/data/sample.ts`.

- [ ] **T1.1 — `useState`: xoá / chuyển cột / sửa tiêu đề card**
  - 📁 Tạo `src/features/boards/BoardPage.tsx`, `src/features/boards/cardUtils.ts`. Sửa `src/App.tsx` để render `<BoardPage />` thay cho `<BoardView />`.
  - ✍️ `cardUtils.ts` (hàm thuần):
    - `nextColumnId(columnId: ColumnId, direction: 'left' | 'right'): ColumnId` — `todo ⇄ doing ⇄ done`, ở biên thì giữ nguyên.
    - `nextOrder(cards: Card[], boardId: string, columnId: ColumnId): number` — `order` lớn nhất trong cột + 1 (cột rỗng → 0).
  - ✍️ `BoardPage({ board, users, initialCards, today })`:
    - `const [cards, setCards] = useState<Card[]>(initialCards)`
    - `const [editingCardId, setEditingCardId] = useState<string | null>(null)`
    - `deleteCard(id: string)`, `moveCard(id: string, direction: 'left' | 'right')` (đặt `order = nextOrder(...)` ở cột mới), `renameCard(id: string, title: string)` (bỏ qua nếu title rỗng).
  - 📋 Truyền vào `BoardView` qua `getCardProps={card => ({ onDelete, onMove, onTitleDoubleClick, titleEditor })}`. Khi `editingCardId === card.id` thì `titleEditor` = `<InlineEdit defaultValue={card.title} onCommit={...} onCancel={...} />`.
  - 🧩 `BoardView`, `InlineEdit`.
  - ✅ Xoá, ←/→, double-click sửa tiêu đề (Enter lưu, Esc huỷ) đều chạy. Không có `push`/`splice`/`sort()`/gán trực tiếp vào phần tử state — chỉ `map`, `filter`, spread, `toSorted`.
  - 📖 [State: A Component's Memory](https://react.dev/learn/state-a-components-memory), [Updating Objects in State](https://react.dev/learn/updating-objects-in-state), [Updating Arrays in State](https://react.dev/learn/updating-arrays-in-state)

- [ ] **T1.2 — Form tạo card (controlled & uncontrolled)**
  - 📁 Tạo `src/features/cards/CreateCardForm.tsx`, `src/features/cards/cardForm.ts`.
  - ✍️ `cardForm.ts` (hàm thuần):
    - `validateCardForm(values: CardFormValues, today: string): CardFormErrors` — title bắt buộc, trim, 3–100 ký tự; description ≤ 500; dueDate (nếu có) không trước `today` (dùng `getDueStatus`). Không lỗi → `{}`.
    - `createCardFromForm(values: CardFormValues, boardId: string, order: number): Card` — `id: crypto.randomUUID()`, `columnId: 'todo'`, `dueDate: values.dueDate || null`, `assigneeId: values.assigneeId || null`, `createdAt: new Date().toISOString()`.
    - `readCardForm(formData: FormData): CardFormValues` — dùng `get`/`getAll`, `isPriority`, `isLabel` để ép kiểu.
  - ✍️ `CreateCardForm({ users, onCreate, onCancel })` với `onCreate: (values: CardFormValues) => void`:
    - **Bản 1 – controlled:** `const [values, setValues] = useState(EMPTY_CARD_FORM)`, `const [errors, setErrors] = useState<CardFormErrors>({})`; `onSubmit` → `preventDefault`, validate, có lỗi thì `setErrors`, không lỗi thì `onCreate(values)` rồi reset form.
    - **Bản 2 – uncontrolled:** viết `CreateCardFormUncontrolled` cùng props, không giữ `values` trong state, đọc bằng `readCardForm(new FormData(e.currentTarget))`. Ghi comment so sánh 2 cách.
  - 📋 Trong `BoardPage`: state `isCreateOpen`; mở form bằng nút "+ Tạo card" ở `toolbar` và `AddCardButton` ở cột "Cần làm" (`renderColumnFooter`). Form nằm trong `<Modal>`. Tạo xong thì đóng modal, card mới ở cuối cột "Cần làm".
  - 🧩 `Modal`, `CardFormFields` (controlled: `values` + `onFieldChange`; uncontrolled: không truyền gì), `FormActions`, `Button`, `AddCardButton`.
  - ✅ Submit sai hiện lỗi dưới đúng ô; sửa xong lỗi biến mất khi submit lại; tạo được card ở cả 2 bản.
  - 📖 [Reacting to Input with State](https://react.dev/learn/reacting-to-input-with-state), [`<input>`](https://react.dev/reference/react-dom/components/input), [`<form>`](https://react.dev/reference/react-dom/components/form)

- [ ] **T1.3 — Lifting state up: bộ lọc + tìm kiếm**
  - 📁 Tạo `src/features/boards/filterCards.ts`. Sửa `App.tsx`, `BoardPage.tsx`.
  - ✍️ `filterCards(cards: Card[], filter: CardFilter, query: string): Card[]` — khớp **tất cả** điều kiện: card có ít nhất 1 label trong `filter.labels` (rỗng = bỏ qua); `priority`; `assigneeId`; `query` không phân biệt hoa thường, tìm trong title + description.
  - 📋 Sidebar (`FilterPanel`) và board (`BoardPage`) là anh em → state phải nằm ở cha chung `App`:
    - `App`: `const [filter, setFilter] = useState(EMPTY_FILTER)`, `const [query, setQuery] = useState('')`.
    - `BoardSidebar filters={<FilterPanel value={filter} onChange={setFilter} users={...} />}`
    - `BoardPage` nhận `filter`, `query`, `onQueryChange`; render `<SearchBox value={query} onChange={...} onClear={...} />` trong `toolbar`; truyền `cards={filterCards(cards, filter, query)}` cho `BoardView`.
  - ✅ **Không** có state `filteredCards` — lọc trực tiếp lúc render. Lọc + tìm kết hợp đúng; "Xoá bộ lọc" hoạt động.
  - 📖 [Sharing State Between Components](https://react.dev/learn/sharing-state-between-components), [Choosing the State Structure](https://react.dev/learn/choosing-the-state-structure)

- [ ] **T1.4 — Snapshot & batching**
  - 📁 Sửa `cardUtils.ts`, `BoardPage.tsx`.
  - ✍️ `nextPriority(p: Priority): Priority` — `low → medium → high → urgent`, `urgent` giữ nguyên.
  - ✍️ Trong `BoardPage`: `bumpOnce(id)` tăng 1 bậc; `handleBump(id)` gọi `bumpOnce(id)` **hai lần** (nút ⏫ muốn tăng 2 bậc).
  - 📋 Bản sai: `bumpOnce` dùng `setCards(cards.map(...))` → bấm chỉ tăng 1 bậc. Thêm `console.log(cards)` ngay sau `setCards`. Bản đúng: `setCards(prev => prev.map(...))`.
  - 🧩 `getCardProps → onBumpPriority`.
  - ✅ Bản đúng: `low` bấm 1 lần thành `high`. Comment trong code giải thích vì sao bản sai chỉ tăng 1 và vì sao log in giá trị cũ.
  - 📖 [State as a Snapshot](https://react.dev/learn/state-as-a-snapshot), [Queueing a Series of State Updates](https://react.dev/learn/queueing-a-series-of-state-updates)

- [ ] **T1.5 — Nhiều board: giữ & reset state**
  - 📁 Sửa `App.tsx`, `BoardPage.tsx`.
  - 📋
    - `App`: `const [activeBoardId, setActiveBoardId] = useState(sampleBoards[0].id)`, truyền `onSelectBoard` cho `BoardSidebar`.
    - **Chuyển state `cards` từ `BoardPage` lên `App`** (cả 2 board dùng chung danh sách card). `BoardPage` nhận `cards` + các hàm cập nhật qua props.
    - Render `<BoardPage key={activeBoardId} ... />` → state cục bộ (`editingCardId`, `isCreateOpen`, form đang gõ dở) tự reset khi đổi board, còn `cards` thì không mất.
    - Thí nghiệm: bỏ `key` → mở form, gõ dở, đổi board → form vẫn còn. Thử khai báo một component **bên trong** `BoardPage` → state của nó mất mỗi lần render.
  - ✅ Đổi board: card đúng board, form/sửa tiêu đề bị reset, card đã thêm/xoá ở board kia vẫn giữ nguyên.
  - 📖 [Preserving and Resetting State](https://react.dev/learn/preserving-and-resetting-state)

- [ ] **T1.6 — `useReducer`**
  - 📁 Tạo `src/features/boards/boardReducer.ts`. Sửa `App.tsx`, `BoardPage.tsx`.
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
  - 📋 `App`: `const [cards, dispatch] = useReducer(boardReducer, sampleCards)`. `BoardPage` chỉ `dispatch(...)`. Reducer dùng lại `nextColumnId`, `nextOrder`, `nextPriority`. `switch` có nhánh `default` kiểm tra exhaustive: `const _exhaustive: never = action`.
  - ✅ Không còn `setCards` nào. Reducer thuần (không `Math.random`, không `Date.now`, không gọi API) — id/ngày tạo sinh ở ngoài trước khi dispatch.
  - 📖 [Extracting State Logic into a Reducer](https://react.dev/learn/extracting-state-logic-into-a-reducer), [`useReducer`](https://react.dev/reference/react/useReducer)

---

## Level 2 — Effects, Refs, Custom Hooks

Từ đây chạy `npm run api` song song với `npm run dev`. Bỏ `src/data/sample.ts` khỏi App.

- [ ] **T2.1 — Gọi API bằng `useEffect`**
  - 📁 Tạo `src/api/boards.ts`, `src/api/cards.ts`, `src/api/comments.ts`. Sửa `App.tsx`, `BoardPage.tsx`, `boardReducer.ts`.
  - ✍️ API (đều dùng `request()`; hàm GET nhận `signal?: AbortSignal`):
    - `getBoards(signal?): Promise<Board[]>`, `getUsers(signal?): Promise<User[]>`
    - `getCards(boardId: string, signal?): Promise<Card[]>`
    - `createCard(input: Omit<Card, 'id'>): Promise<Card>`, `updateCard(id: string, patch: Partial<Card>): Promise<Card>` (PATCH), `deleteCard(id: string): Promise<void>`
    - `getComments(cardId: string, signal?): Promise<Comment[]>`, `addComment(input: Omit<Comment, 'id'>): Promise<Comment>`
  - ✍️ Thêm action `{ type: 'loaded'; boardId: string; cards: Card[] }` (thay card của board đó) và `{ type: 'replaced'; card: Card }`.
  - 📋
    - `App` tải boards + users 1 lần khi mount. Lỗi → `ErrorMessage` có `onRetry`.
    - `BoardPage` tải card mỗi khi `board.id` đổi: state `status: 'loading' | 'error' | 'ready'`, `error: unknown`; dùng `AbortController` trong cleanup để huỷ request cũ. Nút "Thử lại" tăng state `reloadKey` (đưa vào deps).
    - Thao tác ghi (tạo/xoá/chuyển/đổi tên): **chờ API thành công rồi mới dispatch** (pessimistic). Đang chờ thì nút submit `loading`.
  - 🧩 `BoardSkeleton`, `ErrorMessage`, `Button loading`.
  - ✅ `.env.local` đặt `VITE_API_DELAY=2000`, đổi board liên tục → không bao giờ hiện nhầm card board cũ. Refresh trang dữ liệu vẫn còn (đã lưu vào `db.json`).
  - 📖 [Synchronizing with Effects](https://react.dev/learn/synchronizing-with-effects), [Lifecycle of Reactive Effects](https://react.dev/learn/lifecycle-of-reactive-effects), [Fetching data](https://react.dev/reference/react/useEffect#fetching-data-with-effects)

- [ ] **T2.2 — Bỏ effect thừa**
  - 📋 Cố tình viết sai rồi sửa, mỗi trường hợp ghi 1 comment "trước/sau":
    1. `const [visible, setVisible] = useState([]); useEffect(() => setVisible(filterCards(...)), [cards, filter, query])` → đặt `RenderCounter` cạnh để thấy render thừa → sửa thành tính trong render.
    2. `useEffect(() => { setEditingCardId(null) }, [board.id])` → thay bằng `key` (đã làm ở T1.5).
    3. Gửi `deleteCard` bên trong effect theo state `pendingDeleteId` → chuyển vào event handler.
  - ✅ `BoardPage` chỉ còn effect cho việc đồng bộ với bên ngoài (fetch).
  - 📖 [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)

- [ ] **T2.3 — `useRef`**
  - 📁 Sửa `CreateCardForm.tsx`, `App.tsx` (hoặc nơi giữ `query`), `BoardPage.tsx`.
  - 📋
    - (a) Auto focus: `const titleRef = useRef<HTMLInputElement>(null)` → `CardFormFields titleRef={titleRef}`; focus trong `useEffect` khi form mount (không dùng `autoFocus`).
    - (b) Debounce tìm kiếm 300ms: `SearchBox` để **uncontrolled** (`defaultValue`), `onChange` đặt `setTimeout` lưu id trong `timerRef`, huỷ timer cũ trước khi đặt mới, clear khi unmount. `query` chỉ cập nhật sau khi ngừng gõ 300ms. Nút ✕: xoá input qua `inputRef.current.value = ''`.
    - (c) Đếm render `BoardPage`: `renderCount = useRef(0)`, tăng mỗi lần render, hiện bằng `<RenderCounter count={...} />` trong `toolbar`.
  - ✅ Đủ 3 tính năng. Comment giải thích vì sao (c) không thể là state; vì sao trong StrictMode số đếm tăng 2.
  - 📖 [Referencing Values with Refs](https://react.dev/learn/referencing-values-with-refs), [Manipulating the DOM with Refs](https://react.dev/learn/manipulating-the-dom-with-refs)

- [ ] **T2.4 — Custom hooks**
  - 📁 `src/hooks/useFetch.ts`, `useDebouncedValue.ts`, `useLocalStorage.ts`, `useKeyboardShortcut.ts`.
  - ✍️
    - `useFetch<T>(load: (signal: AbortSignal) => Promise<T>, deps: unknown[]): { data: T | undefined; error: unknown; loading: boolean; reload: () => void }`
    - `useDebouncedValue<T>(value: T, delayMs: number): T`
    - `useLocalStorage<T>(key: string, initial: T): [T, (next: T | ((prev: T) => T)) => void]` — đọc lười (lazy init), JSON parse lỗi thì dùng `initial`, `try/catch` khi ghi.
    - `useKeyboardShortcut(key: string, handler: (e: KeyboardEvent) => void, options?: { enabled?: boolean })` — bỏ qua khi đang gõ trong input/textarea.
  - 📋 Áp dụng: `useFetch` cho boards/users/cards; `useDebouncedValue` thay cho timer thủ công ở T2.3b (SearchBox trở lại controlled); `useLocalStorage` nhớ `filter` và `activeBoardId`; phím `/` focus ô tìm kiếm, phím `n` mở form tạo card.
  - ✅ Component ngắn đi rõ rệt; `npm run lint` không có cảnh báo `exhaustive-deps`.
  - 📖 [Reusing Logic with Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks), [Rules of Hooks](https://react.dev/reference/rules/rules-of-hooks)

- [ ] **T2.5 — `useLayoutEffect`: tooltip mô tả card**
  - 📁 `src/features/cards/tooltipPosition.ts`, `src/features/cards/CardTooltip.tsx`. Sửa `BoardPage.tsx`.
  - ✍️ `computeTooltipPosition(anchor: DOMRect, size: { width: number; height: number }, viewport: { width: number; height: number }, gap = 8): { top: number; left: number }` — mặc định nằm **dưới** card căn trái; tràn đáy → lật lên trên; tràn phải → dịch sang trái; không bao giờ < 8px so với mép.
  - ✍️ `CardTooltip({ anchor, text }: { anchor: DOMRect; text: string })` — render `TooltipBox` ở vị trí tạm, `useLayoutEffect` đo `ref.current.getBoundingClientRect()` rồi set vị trí thật.
  - 📋 `BoardPage`: state `hovered: { text: string; rect: DOMRect } | null`; gắn qua `getCardProps → articleProps.onMouseEnter/onMouseLeave` (`e.currentTarget.getBoundingClientRect()`). Card không có mô tả thì không hiện.
  - ✅ Làm bằng `useEffect` trước (thấy nháy ở vị trí sai), đổi sang `useLayoutEffect` thì hết. Tooltip không tràn màn hình ở card góc dưới-phải.
  - 📖 [`useLayoutEffect`](https://react.dev/reference/react/useLayoutEffect)

- [ ] **T2.6 — `useSyncExternalStore`**
  - 📁 `src/hooks/useOnlineStatus.ts`, `src/hooks/useMediaQuery.ts`. Sửa `App.tsx`, `BoardPage.tsx`.
  - ✍️ `useOnlineStatus(): boolean` (sự kiện `online`/`offline`), `useMediaQuery(query: string): boolean` (`matchMedia(...).addEventListener('change', ...)`). Cả hai dùng `useSyncExternalStore`, có `getServerSnapshot`.
  - 📋 Offline → `Layout banner={<Banner tone="warning">Mất kết nối…</Banner>}`. Màn hình ≤ 768px → không render `sidebar`; thay bằng nút "Bộ lọc" trong `toolbar` mở `FilterPanel` trong `Modal`.
  - ✅ DevTools → Network → Offline thấy banner; thu nhỏ cửa sổ thấy nút Bộ lọc. Không dùng `useState` + `useEffect` trong 2 hook.
  - 📖 [`useSyncExternalStore`](https://react.dev/reference/react/useSyncExternalStore)

- [ ] **T2.7 — `useEffectEvent`**
  - 📁 Sửa `BoardPage.tsx`.
  - 📋 Mỗi khi mở board (đổi `board.id`) ghi `console.info('[analytics] open board', board.id, { visibleCount })` với `visibleCount` = số card đang hiển thị sau lọc. Đổi bộ lọc/tìm kiếm **không** được ghi log lại, nhưng log phải có `visibleCount` mới nhất. Dùng `const onOpen = useEffectEvent(...)`.
  - ✅ Đổi filter: không log. Đổi board: đúng 1 log ở production (`npm run build && npm run preview`); dev StrictMode có thể 2 — comment giải thích.
  - 📖 [Separating Events from Effects](https://react.dev/learn/separating-events-from-effects), [`useEffectEvent`](https://react.dev/reference/react/useEffectEvent)

---

## Level 3 — Router, Context, Kiến trúc

- [ ] **T3.1 — Routing**
  - 📁 Tạo `src/app/router.tsx`, `src/app/RootLayout.tsx`, `src/features/cards/CardDetailRoute.tsx`, `src/hooks/useFilterParams.ts`. Sửa `main.tsx`/`App.tsx`, `BoardPage.tsx`, `BoardSidebar.tsx` (đổi `<button>` thành `<NavLink className="board-sidebar__item">`).
  - 📋 Routes (`react-router` đã cài):
    | Path | Element |
    | --- | --- |
    | `/` | `<Navigate to="/boards" />` |
    | `/boards` | chuyển tới board đầu tiên, hoặc `EmptyState` nếu chưa có |
    | `/boards/:boardId` | `BoardPage` (đọc `useParams`) |
    | `/boards/:boardId/cards/:cardId` | **route con** của board: `CardDetailRoute` = `Modal` + `CardDetail` hiện **đè lên** board (BoardPage render `<Outlet />`) |
    | `/stats`, `/settings` | `StatsPage`, `SettingsPage` (tạm thời là `PageHeader` rỗng) |
    | `*` | `NotFoundView` + `<Link to="/boards">` |
  - 📋 `RootLayout` dùng `Layout` với `nav` = 3 `<NavLink className="layout__nav-link">` (Board, Thống kê, Cài đặt) + `<Outlet />`.
  - ✍️ `useFilterParams(): [{ filter: CardFilter; query: string }, (next: Partial<{ filter: CardFilter; query: string }>) => void]` — đọc/ghi `?label=bug&label=docs&priority=high&assignee=u1&q=login` bằng `useSearchParams`. Thay cho state/localStorage của filter.
  - 📋 `CardItem onOpen` → `navigate(\`cards/${card.id}\`)`; đóng modal → `navigate('..')` giữ nguyên search params. `cardId` không tồn tại → `NotFoundView` trong modal.
  - ✅ Refresh ở `/boards/b1/cards/c1?label=bug` vẫn mở đúng card và đúng bộ lọc. Back/Forward của trình duyệt hoạt động.
  - 📖 [React Router](https://reactrouter.com/home)

- [ ] **T3.2 — Context: Theme & Auth**
  - 📁 `src/context/ThemeContext.tsx`, `src/context/AuthContext.tsx`, `src/features/auth/LoginPage.tsx`, `src/features/auth/RequireAuth.tsx`, `src/features/settings/SettingsPage.tsx`.
  - ✍️
    - `ThemeProvider({ children })`; `useTheme(): { theme: Theme; setTheme(t: Theme): void; toggleTheme(): void }` — ném lỗi nếu dùng ngoài Provider. Lưu bằng `useLocalStorage`; effect gán `document.documentElement.dataset.theme`. Mặc định theo `prefers-color-scheme`.
    - `AuthProvider({ children })`; `useAuth(): { user: User | null; login(user: User): void; logout(): void }` — lưu user trong localStorage.
    - `RequireAuth({ children })` — chưa đăng nhập → `<Navigate to="/login" state={{ from: location }} replace />`.
    - `LoginPage` — `LoginView` + `getUsers()`; đăng nhập xong quay về trang `from`.
    - `SettingsPage` — `SettingsView` với `useTheme()` + `useAuth()`.
  - 📋 Header: `headerActions={<><ThemeToggle .../><UserMenu .../></>}`. Comment mới dùng `user.id` làm `authorId`. Provider viết dạng React 19: `<ThemeContext value={...}>`.
  - ✅ Không truyền `theme`/`user` qua props ở bất kỳ đâu (trừ vào component UI).
  - 📖 [Passing Data Deeply with Context](https://react.dev/learn/passing-data-deeply-with-context), [`createContext`](https://react.dev/reference/react/createContext)

- [ ] **T3.3 — Context + Reducer**
  - 📁 `src/context/BoardContext.tsx`. Sửa `App`/`RootLayout`, `BoardPage.tsx`.
  - ✍️
    - `BoardProvider({ children })` — `useReducer(boardReducer, [])`, tải `boards`, `users`.
    - `BoardStateContext` chứa `{ boards: Board[]; users: User[]; usersById: Record<string, User>; cards: Card[] }`; `BoardDispatchContext` chứa `dispatch`.
    - `useBoardState()`, `useBoardDispatch()` — ném lỗi ngoài Provider.
    - (tuỳ chọn) `useCardActions()` trả `{ create, remove, move, rename }` gói "gọi API + dispatch".
  - 📋 Bỏ hết props `cards`/`dispatch`/`users` đi xuyên qua các tầng.
  - ✅ Đặt `RenderCounter` trong một component chỉ dùng `useBoardDispatch()` → nó **không** render lại khi card thay đổi (so với khi gộp 1 context).
  - 📖 [Scaling Up with Reducer and Context](https://react.dev/learn/scaling-up-with-reducer-and-context)

- [ ] **T3.4 — Portal + hành vi Modal**
  - 📁 Sửa `src/components/ui/Modal.tsx`.
  - 📋 `createPortal(..., document.body)`; Esc → `onClose` (listener `keydown` trong effect, cleanup); click backdrop → `onClose` nhưng click trong panel thì không (`e.target === e.currentTarget`); khoá scroll `document.body.style.overflow = 'hidden'` khi mở, khôi phục giá trị cũ khi đóng.
  - 📋 Thí nghiệm: đặt `onClick={() => console.log('bubble')}` trên một `div` bọc ngoài `Modal` trong `BoardPage` → click trong modal vẫn log dù DOM của modal nằm ở `body`. Ghi comment giải thích.
  - ✅ Modal chi tiết card (T3.1) và form tạo card đều có đủ hành vi trên. 2 modal lồng nhau (xác nhận xoá trong chi tiết card) — Esc chỉ đóng cái trên cùng.
  - 📖 [`createPortal`](https://react.dev/reference/react-dom/createPortal)

- [ ] **T3.5 — Ref as prop & `useImperativeHandle`**
  - 📁 `src/components/ConfirmDialog.tsx`. Sửa `BoardPage.tsx`, `CardDetailRoute.tsx`.
  - ✍️
    ```ts
    export interface ConfirmDialogHandle {
      open(message: string, options?: { confirmText?: string; danger?: boolean }): Promise<boolean>
    }
    export function ConfirmDialog({ ref }: { ref: Ref<ConfirmDialogHandle> })
    ```
    Bên trong: state `{ open, message, options }`, lưu hàm `resolve` của Promise trong `useRef`, `useImperativeHandle(ref, () => ({ open }))`, render `ConfirmDialogView`.
  - 📋 Xoá card: `if (await confirmRef.current?.open(\`Xoá "${card.title}"?\`, { danger: true })) remove(card.id)`.
  - 📋 Đọc lại `Field.tsx`: `ref` đi tới `<input>` qua `...rest` mà không cần `forwardRef` — ghi comment vì sao (React 19).
  - ✅ Huỷ → không xoá; Đồng ý → xoá; đóng bằng Esc = huỷ.
  - 📖 [`useImperativeHandle`](https://react.dev/reference/react/useImperativeHandle), [ref as a prop](https://react.dev/blog/2024/12/05/react-19#ref-as-a-prop)

- [ ] **T3.6 — `useId`**
  - 📁 Sửa `src/components/ui/Field.tsx`, `CardFormFields.tsx`.
  - 📋 `id` của `TextField`, `TextAreaField`, `SelectField`, `CheckboxGroup` thành **tuỳ chọn**: không truyền thì dùng `useId()`. Bỏ prop `idPrefix` của `CardFormFields`.
  - ✅ Mở cùng lúc form tạo card và một `CardFormFields` khác (vd. trong Gallery) → chạy `[...document.querySelectorAll('[id]')].map(e => e.id)` trong console không có id trùng; click label vẫn focus đúng ô.
  - 📖 [`useId`](https://react.dev/reference/react/useId)

- [ ] **T3.7 — Error Boundary**
  - 📁 `src/components/ErrorBoundary.tsx`. Sửa `BoardView.tsx` (bọc từng `Column`), `RootLayout.tsx` (bọc `Outlet`).
  - ✍️
    ```ts
    interface ErrorBoundaryProps {
      fallback: (error: unknown, reset: () => void) => ReactNode
      resetKeys?: unknown[] // đổi giá trị → tự reset
      children: ReactNode
    }
    class ErrorBoundary extends Component<ErrorBoundaryProps, { error: unknown }>
    ```
    Có `static getDerivedStateFromError`, `componentDidCatch` (log), `componentDidUpdate` so `resetKeys`.
  - 📋 Thử lỗi: trong `getCardProps` của `BoardPage`, nếu `card.title.includes('💣')` thì `throw new Error('Card bom!')` (hàm này chạy lúc Column render). Tạo card tên "💣".
  - 🧩 `ErrorMessage compact` làm fallback cột; `ErrorMessage` làm fallback trang.
  - ✅ Chỉ cột chứa card bom báo lỗi, 2 cột kia vẫn chạy; "Thử lại" sau khi xoá card bom (qua API/db.json) thì cột hồi phục. Comment: lỗi trong event handler/async **không** bị boundary bắt — thử để thấy.
  - 📖 [Catching rendering errors with an Error Boundary](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)

---

## Level 4 — React 19: Suspense, Actions, Hooks mới

- [ ] **T4.1 — `lazy` + `Suspense`**
  - 📁 Sửa `router.tsx`, `RootLayout.tsx`.
  - 📋 `const StatsPage = lazy(() => import('../features/stats/StatsPage'))`, tương tự `SettingsPage` (file phải `export default`). `<Suspense fallback={<PageSkeleton />}>` bọc `Outlet`.
  - ✅ `npm run build` có chunk riêng cho 2 trang; tab Network chỉ tải chunk khi mở trang.
  - 📖 [`lazy`](https://react.dev/reference/react/lazy), [`<Suspense>`](https://react.dev/reference/react/Suspense)

- [ ] **T4.2 — `use()` đọc comment**
  - 📁 `src/api/commentsCache.ts`, `src/features/cards/CommentsSection.tsx`. Sửa `CardDetailRoute.tsx`.
  - ✍️
    - `getCommentsPromise(cardId: string): Promise<Comment[]>` — cache trong `Map<string, Promise<Comment[]>>`; `invalidateComments(cardId: string): void`.
    - `CommentsSection({ cardId })` = `ErrorBoundary` › `Suspense fallback={<CommentListSkeleton />}` › `Comments({ promise })`.
    - `Comments({ promise })`: `const comments = use(promise)`; nếu `comments.length > 0` thì mới `const { usersById } = use(BoardStateContext)` (gọi `use` trong `if` — điều mà hook khác không được phép).
  - 📋 Thí nghiệm: tạo promise mới mỗi render (`use(getComments(cardId))` không cache) → thấy request lặp vô hạn trong Network. Ghi comment.
  - 🧩 `CardDetail children={<CommentsSection … />}`, `CommentList`.
  - ✅ Mở lại card đã xem → comment hiện ngay không skeleton.
  - 📖 [`use`](https://react.dev/reference/react/use)

- [ ] **T4.3 — Form Actions + `useActionState`**
  - 📁 Viết lại `CreateCardForm.tsx`.
  - ✍️
    ```ts
    type CreateCardState = { errors?: CardFormErrors; values?: Partial<CardFormValues>; createdId?: string }
    async function createCardAction(prev: CreateCardState, formData: FormData): Promise<CreateCardState>
    const [state, formAction, isPending] = useActionState(createCardAction, {})
    ```
  - 📋 `<form action={formAction}>`; action: `readCardForm` → `validateCardForm` → lỗi thì trả `{ errors, values }` → hợp lệ thì `await createCard(...)`, `dispatch({ type: 'added' })`, trả `{ createdId }`. Lỗi API → `errors.form` hiện bằng `FormMessage`. Có lỗi thì truyền `defaultValues={state.values}` để không mất dữ liệu đã gõ (form tự reset sau mỗi action). Thành công → đóng modal.
  - ✅ Không còn `onSubmit`, `preventDefault`, state loading thủ công. Đặt `VITE_API_FAIL_RATE=1` để thử lỗi server.
  - 📖 [`useActionState`](https://react.dev/reference/react/useActionState), [`<form>`](https://react.dev/reference/react-dom/components/form)

- [ ] **T4.4 — `useFormStatus`**
  - 📁 `src/components/SubmitButton.tsx`.
  - ✍️ `SubmitButton({ children, pendingText = 'Đang lưu…' })` — `const { pending } = useFormStatus()` → `<Button type="submit" variant="primary" loading={pending}>`.
  - 📋 Dùng trong `CreateCardForm` và form bình luận (`CommentComposerFields submit={<SubmitButton>Gửi</SubmitButton>}`). Thử đặt `useFormStatus` ngay trong component chứa `<form>` → luôn `false`; ghi comment vì sao.
  - ✅ Không truyền prop `loading`/`isPending` nào xuống nút.
  - 📖 [`useFormStatus`](https://react.dev/reference/react-dom/hooks/useFormStatus)

- [ ] **T4.5 — `useOptimistic` + Toast**
  - 📁 `src/context/ToastContext.tsx`. Sửa `BoardPage.tsx`, `CommentsSection.tsx`.
  - ✍️ `ToastProvider`, `useToast(): { show(kind: ToastItem['kind'], message: string): void }` — tự ẩn sau 4s (timer có cleanup), render `ToastStack`.
  - ✍️ Board:
    ```ts
    const [optimisticCards, moveOptimistic] = useOptimistic(cards, (state, m: { id: string; toColumnId: ColumnId }) => ...)
    function handleDropCard(cardId: string, toColumnId: ColumnId) {
      startTransition(async () => { moveOptimistic(...); try { await updateCard(...); dispatch(...) } catch { toast.show('error', '...') } })
    }
    ```
    Truyền `onDropCard={handleDropCard}` cho `BoardView`, nút ←/→ cũng dùng chung. Card đang chờ: `isPending` (so `optimisticCards` với `cards`).
  - ✍️ Comment: `useOptimistic(comments, (state, c: CommentView) => [...state, { ...c, pending: true }])`; gửi xong `invalidateComments` + làm mới promise.
  - ✅ `VITE_API_DELAY=2000`: kéo thả thấy card sang cột mới ngay, mờ đến khi xong. `VITE_API_FAIL_RATE=0.5`: lỗi thì card tự quay về + toast đỏ.
  - 📖 [`useOptimistic`](https://react.dev/reference/react/useOptimistic)

- [ ] **T4.6 — `useTransition`**
  - 📁 `src/api/cardsCache.ts`. Sửa `BoardPage.tsx`, `RootLayout.tsx`.
  - 📋 Chuyển việc tải card sang Suspense: `getCardsPromise(boardId)` có cache (giống T4.2), `BoardPage` đọc bằng `use()`, `Suspense fallback={<BoardSkeleton />}` bọc ngoài. Thêm `Tabs` phía trên board (`items` = các board) — `onSelect` gọi `startTransition(() => navigate(...))`, `pendingId` = board đang chuyển tới khi `isPending`, `BoardView isStale={isPending}`.
  - ✅ So sánh: đổi board bằng sidebar (không transition) → nháy skeleton; bằng Tabs → board cũ mờ đi rồi chuyển. Comment giải thích.
  - 📖 [`useTransition`](https://react.dev/reference/react/useTransition)

- [ ] **T4.7 — `useDeferredValue`**
  - 📁 `src/features/stats/StatsPage.tsx`, `src/features/stats/SearchResults.tsx`, thêm `getAllCards()` vào `src/api/cards.ts`.
  - 📋 Chạy `npm run api:big`. `StatsPage`: `SearchBox` (controlled, **không debounce**) + `SearchResults({ cards, query, usersById })` bọc `memo`, render **toàn bộ** kết quả bằng `CardRow` trong `ListFrame height={480} count={...}`.
    - Bước 1: gõ thấy giật.
    - Bước 2: `const deferredQuery = useDeferredValue(query)`; truyền `deferredQuery` cho `SearchResults`; `isStale = query !== deferredQuery` → `ListFrame isStale`, `SearchBox busy`.
  - ✅ Gõ mượt, danh sách mờ khi đang tính. Comment: khác gì debounce (T2.4)?
  - 📖 [`useDeferredValue`](https://react.dev/reference/react/useDeferredValue)

- [ ] **T4.8 — `<Activity>`**
  - 📁 Sửa `StatsPage.tsx`.
  - 📋 Chia trang Stats thành 3 tab (`Tabs`): "Tổng quan" (`StatsOverview`, dùng tạm số liệu tính bằng vòng lặp đơn giản), "Tìm kiếm" (T4.7), "Profiler" (T5.2). Mỗi tab bọc `<Activity mode={tab === id ? 'visible' : 'hidden'}>`.
  - ✅ Gõ tìm kiếm + cuộn xuống, sang tab khác rồi quay lại → còn nguyên. Thêm `useEffect` có `console.log` mount/cleanup trong tab Tìm kiếm để thấy effect bị dọn khi ẩn. So sánh với `{tab === 'search' && ...}`.
  - 📖 [`<Activity>`](https://react.dev/reference/react/Activity)

- [ ] **T4.9 — Metadata & tài nguyên**
  - 📋 Render `<title>` + `<meta name="description">` ngay trong `BoardPage` (`"{board.title} · TaskFlow"`), `StatsPage`, `SettingsPage`, `LoginPage`. Gọi `preconnect(API_URL)` trong `RootLayout`.
  - ✅ Tiêu đề tab trình duyệt đổi theo trang.
  - 📖 [`<title>`](https://react.dev/reference/react-dom/components/title), [`preconnect`](https://react.dev/reference/react-dom/preconnect)

---

## Level 5 — Hiệu năng & React Profiler

Chạy `npm run api:big`. Ghi mọi số đo vào `PERF.md`. **Đo trước → sửa → đo lại.**

- [ ] **T5.1 — React DevTools Profiler (baseline)**
  - 📋 Cài extension React Developer Tools. Trong Settings của tab Profiler bật "Record why each component rendered"; trong Components bật "Highlight updates". Ghi profile 3 kịch bản: gõ 5 ký tự ở trang Stats › Tìm kiếm; kéo 1 card trên board; đổi theme.
  - ✅ Bảng baseline trong `PERF.md` + 3 component tốn thời gian nhất (Ranked chart) + lý do render của chúng.
  - 📖 [React Developer Tools](https://react.dev/learn/react-developer-tools), [Introducing the React Profiler](https://legacy.reactjs.org/blog/2018/09/10/introducing-the-react-profiler.html)

- [ ] **T5.2 — `<Profiler>` API**
  - 📁 `src/features/stats/profilerStore.ts`, sửa `StatsPage.tsx`, `BoardPage.tsx`.
  - ✍️ `profilerStore.ts`: `record(row: ProfilerRow)` (giữ 20 dòng mới nhất), `clear()`, `subscribe(listener)`, `getSnapshot()`; hook `useProfilerRows(): ProfilerRow[]` qua `useSyncExternalStore`. Hàm `onRender: ProfilerOnRenderCallback` gọi `record`.
  - 📋 Bọc `<Profiler id="SearchResults" onRender={onRender}>` và `<Profiler id="BoardView" ...>`. Tab "Profiler" hiện `ProfilerTable rows={useProfilerRows()} onClear={clear}`.
  - ⚠️ Vì sao **không** dùng `useState` trong `onRender`? (thử → vòng lặp render). Ghi comment.
  - ✅ Bảng cập nhật khi thao tác. Comment giải thích `actualDuration` vs `baseDuration`.
  - 📖 [`<Profiler>`](https://react.dev/reference/react/Profiler)

- [ ] **T5.3 — `memo`, `useMemo`, `useCallback`**
  - 📁 `src/features/stats/computeStats.ts`, sửa các component bị Profiler chỉ ra.
  - ✍️ `computeBoardStats(cards: Card[], today: string): BoardStats` — thay số liệu tạm ở T4.8; bọc `useMemo`.
  - 📋 Sửa đúng 3 điểm nóng từ T5.1. Hai thí nghiệm memo **vô dụng**: truyền `style={{...}}` mới mỗi render vào component `memo`; truyền `children` JSX vào component `memo`.
  - ✅ `PERF.md` có số trước/sau cho từng thay đổi + giải thích 2 thí nghiệm.
  - 📖 [`memo`](https://react.dev/reference/react/memo), [`useMemo`](https://react.dev/reference/react/useMemo), [`useCallback`](https://react.dev/reference/react/useCallback)

- [ ] **T5.4 — Sửa cấu trúc thay vì memo**
  - 📋 Không dùng memo: (a) đưa state `query` xuống component nhỏ nhất cần nó; (b) truyền phần nặng qua `children` để không bị render lại; (c) kiểm tra `ThemeContext` đổi theme có kéo cả board render lại không, tách nếu cần.
  - ✅ Ít nhất 1 chỗ bỏ được memo mà vẫn nhanh bằng — có số liệu.
  - 📖 [Before you memo()](https://overreacted.io/before-you-memo/)

- [ ] **T5.5 — Virtualization**
  - 📁 `src/components/VirtualList.tsx`.
  - ✍️
    ```ts
    interface VirtualListProps<T> {
      items: T[]
      itemHeight: number // dùng CARD_ROW_HEIGHT
      height: number
      overscan?: number // mặc định 5
      renderItem: (item: T, index: number, style: CSSProperties) => ReactNode
    }
    ```
    Dùng `ListFrame` (`ref`, `onScroll`); state `scrollTop`; tính `startIndex`, `endIndex`; div bên trong cao `items.length * itemHeight`; mỗi item `position: absolute; top: index * itemHeight`.
  - 📋 Thay danh sách ở `SearchResults`. Sau đó thử `@tanstack/react-virtual` và so sánh.
  - ✅ DOM trong `ListFrame` < 100 node dù 5.000 kết quả; số liệu mount trước/sau trong `PERF.md`.
  - 📖 [TanStack Virtual](https://tanstack.com/virtual/latest)

- [ ] **T5.6 — Chrome Performance + React tracks**
  - 📋 Chrome DevTools › Performance, ghi khi gõ tìm kiếm có/không có `useDeferredValue`. Tìm track "Scheduler ⚛" và "Components ⚛".
  - ✅ Ảnh chụp 2 bản ghi + nhận xét (Blocking vs Transition lane, long task) trong `PERF.md`.
  - 📖 [React Performance Tracks](https://react.dev/reference/dev-tools/react-performance-tracks)

- [ ] **T5.7 — React Compiler**
  - 📋 Bật React Compiler cho Vite theo hướng dẫn chính thức (copy project ra thư mục khác để thử). Xoá `memo`/`useMemo`/`useCallback` thủ công, profile lại, so với T5.3. Xem badge "Memo ✨" trong DevTools.
  - ✅ `PERF.md` có số liệu + kết luận giữ memo thủ công ở đâu (nếu có).
  - 📖 [React Compiler](https://react.dev/learn/react-compiler), [Rules of React](https://react.dev/reference/rules)

---

## Level 6 — Chất lượng

- [ ] **T6.1 — Testing**
  - 📁 Test đặt cạnh file: `xxx.test.ts(x)`.
  - 📋 Tối thiểu:
    - `boardReducer.test.ts` — mọi action, kể cả không mutate state cũ.
    - `filterCards.test.ts`, `cardForm.test.ts`, `tooltipPosition.test.ts`, `computeStats.test.ts`, `src/utils/date.test.ts`.
    - `useDebouncedValue.test.ts` — `renderHook` + `vi.useFakeTimers()`.
    - `CreateCardForm.test.tsx` — `userEvent` gõ, submit, thấy lỗi; mock `fetch` (`vi.spyOn(globalThis, 'fetch')`) để thử tạo thành công. Đặt `VITE_API_DELAY=0` cho test (`vite.config.ts › test.env`).
  - ✅ `npm test` xanh, ≥ 20 test. Query theo role/label, không theo class.
  - 📖 [Testing Library](https://testing-library.com/docs/react-testing-library/intro), [Vitest](https://vitest.dev/guide/)

- [ ] **T6.2 — StrictMode**
  - 📋 Rà lại mọi effect/subscription: request ghi nào bị gửi 2 lần? listener nào bị đăng ký 2 lần? timer nào không clear? Sửa bằng cleanup đúng.
  - ✅ Danh sách lỗi đã tìm thấy + cách sửa trong comment hoặc ghi chú.
  - 📖 [`<StrictMode>`](https://react.dev/reference/react/StrictMode)

- [ ] **T6.3 — Accessibility**
  - 📁 Sửa `BoardPage.tsx`, `Modal.tsx`.
  - 📋
    - Card focus được: `articleProps={{ tabIndex: 0, onKeyDown }}`; `ArrowLeft/ArrowRight` chuyển cột, `Enter` mở chi tiết, `Delete` xoá (có xác nhận). Sau khi chuyển cột, focus đi theo card.
    - Modal: focus phần tử đầu tiên khi mở, Tab/Shift+Tab không thoát ra ngoài, đóng thì trả focus về phần tử đã mở modal.
    - Vùng `aria-live="polite"` ẩn (class `sr-only` tự viết) đọc "Đã chuyển … sang Đang làm".
  - ✅ Dùng toàn bộ app không cần chuột.
  - 📖 [Accessibility (MDN)](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility)

---

## Level 7 — Next.js App Router & Server Components

```bash
npx create-next-app@latest taskflow-next --ts --app --eslint --src-dir
```

Copy sang project mới: `src/types.ts`, `src/components/`, `src/features/**/…View.tsx` + các component UI + CSS. json-server vẫn chạy từ `taskflow/` (`npm run api`).

- [ ] **T7.1 — Port giao diện**
  - 📋 `app/layout.tsx` dùng `Layout`; `app/boards/[boardId]/page.tsx` render `BoardView` với dữ liệu fetch trên server. Component dùng hook/event (`Column`, `Modal`, `SearchBox`…) cần `'use client'` ở đầu file.
  - ✅ Board hiển thị đúng dữ liệu.
  - 📖 [Next.js App Router](https://nextjs.org/docs/app)

- [ ] **T7.2 — Server vs Client Components**
  - 📋 `page.tsx` là `async` component `await fetch('http://localhost:3001/...')`. Tách `BoardClient` (`'use client'`) chứa tìm kiếm/kéo thả. Truyền Server Component làm `children` của Client Component.
  - ✅ Sơ đồ cây component đánh dấu Server/Client trong README; kiểm tra bundle client không chứa code fetch.
  - 📖 [Server Components](https://react.dev/reference/rsc/server-components), [`'use client'`](https://react.dev/reference/rsc/use-client)

- [ ] **T7.3 — Server Functions**
  - 📋 `app/actions.ts` với `'use server'`: `createCard(prev, formData)`, `moveCard(cardId, toColumnId)`, `addComment(prev, formData)`; gọi `revalidatePath`. Dùng lại `useActionState`, `useOptimistic`, `SubmitButton` từ Level 4.
  - ✅ Tắt JavaScript trong DevTools vẫn tạo được card.
  - 📖 [Server Functions](https://react.dev/reference/rsc/server-functions), [`'use server'`](https://react.dev/reference/rsc/use-server)

- [ ] **T7.4 — Streaming**
  - 📋 `loading.tsx` (dùng `BoardSkeleton`), `error.tsx` (dùng `ErrorMessage`), `not-found.tsx` (dùng `NotFoundView`); `<Suspense>` riêng cho phần thống kê (cố tình chậm 3s).
  - ✅ Khung trang hiện ngay, phần chậm "chảy" vào sau.
  - 📖 [loading.js](https://nextjs.org/docs/app/api-reference/file-conventions/loading)

- [ ] **T7.5 — Promise từ Server sang Client**
  - 📋 Server Component gọi `getComments(cardId)` **không await**, truyền promise vào Client Component đọc bằng `use()` trong `<Suspense fallback={<CommentListSkeleton />}>`.
  - ✅ Comment giải thích khác biệt với T4.2 (ai tạo promise, cache ở đâu).
  - 📖 [`use` — streaming data from server to client](https://react.dev/reference/react/use#streaming-data-from-server-to-client)

---

🎓 **Hoàn thành:** đối chiếu `CONCEPTS.md` — mọi dòng đã được đánh dấu là bạn đã đi qua gần như toàn bộ React hiện đại.
