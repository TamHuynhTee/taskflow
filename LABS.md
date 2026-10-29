# Labs — React nâng cao

12 bài nhỏ, mỗi bài là **một component đang có bug** (🐞) hoặc **cần implement thêm** (🛠).
Không cần API hay đăng nhập.

```bash
npm run test:labs          # tự chấm: test ĐỎ cho tới khi bạn sửa đúng
npm run test:labs:watch    # vừa sửa vừa xem test
npm run dev                # xem demo: http://localhost:5173/labs
```

Cách làm mỗi bài:
1. Mở demo `/labs/NN`, **tái hiện bug** bằng mắt (mở cả Console / React DevTools).
2. Đọc comment đầu file: mô tả bug + những gì phải giữ nguyên (tên export, chữ trên nút…) vì test dựa vào đó.
3. **Giải thích bằng lời** vì sao bug xảy ra *trước* khi sửa. Ghi 1–2 dòng comment `// Vì sao:` vào file.
4. Sửa → `npm run test:labs` xanh bài đó. Không sửa file test (trừ chỗ test cho phép).
5. Nhắn **"review lab NN"** để được review.

Gợi ý được giấu trong `<details>` — cố gắng tự nghĩ ≥ 15 phút trước khi mở.

| # | Bài | Khái niệm | Loại |
| --- | --- | --- | --- |
| 01 | Đồng hồ đứng im | Stale closure, updater function | 🐞 |
| 02 | Kết quả tìm kiếm nhảy lung tung | Race condition, cleanup | 🐞 |
| 03 | Fetch không bao giờ dừng | Referential equality, deps | 🐞 |
| 04 | memo mà vẫn render lại | `memo`, `useCallback`, props ổn định | 🐞 |
| 05 | Context kéo cả cây render | Context value, tách context | 🐞 |
| 06 | Lab crash vì getSnapshot | `useSyncExternalStore` | 🐞 |
| 07 | Bản nháp dính sang card khác | Reset state bằng `key` | 🐞 |
| 08 | Reducer bấm không ăn | Immutability, reducer thuần | 🐞 |
| 09 | Đổi theme bị rớt kết nối | `useEffectEvent` | 🐞 |
| 10 | Suspense kẹt mãi | `use(promise)`, cache promise | 🐞 |
| 11 | Lỗi async lọt khỏi Error Boundary | Error Boundary + async | 🛠 |
| 12 | Nút like phải chờ server | `useOptimistic`, transition | 🛠 |

---

### 01 — Đồng hồ đứng im · `src/labs/01-stale-closure/Stopwatch.tsx`
Bấm "Bắt đầu", đồng hồ lên 1 rồi đứng im. `npm run lint` cũng đang mách bạn một điều.
- Câu hỏi: hàm trong `setInterval` "nhìn thấy" biến `seconds` của lần render nào?
- Có ít nhất 2 cách sửa. Cách nào không cần tạo lại interval mỗi giây? Vì sao cách đó tốt hơn?
<details><summary>Gợi ý</summary>

Closure chụp `seconds` của render lúc effect chạy (= 0) → mãi là `setSeconds(0 + 1)`. Dùng updater `setSeconds(s => s + 1)`: React đưa giá trị mới nhất vào, effect không cần phụ thuộc `seconds`.
</details>

### 02 — Kết quả tìm kiếm nhảy lung tung · `src/labs/02-race-condition/CardSearch.tsx`
Gõ thật nhanh "lo" ở demo: kết quả cuối cùng là của "l". Có 2 test: request về sai thứ tự, và xoá ô tìm kiếm khi request cũ chưa về.
<details><summary>Gợi ý</summary>

Mỗi lần effect chạy lại, cleanup của lần trước chạy trước. Đặt `let ignore = false` trong effect, cleanup gán `ignore = true`, chỉ `setResults` khi `!ignore`. (Hoặc `AbortController` nếu API hỗ trợ `signal` — như `useFetch` trong app.)
</details>

### 03 — Fetch không bao giờ dừng · `src/labs/03-object-deps/BoardCards.tsx`
Console log "load lần 1, 2, 3…" mãi mãi. Không được sửa bằng `[]`.
- Câu hỏi: `{ a: 1 } === { a: 1 }`? React so sánh deps bằng gì?
<details><summary>Gợi ý</summary>

`options` là object mới mỗi render → deps luôn "đổi" → effect chạy → `setCards` → render → object mới… Tạo object **bên trong** effect và phụ thuộc vào giá trị nguyên thuỷ `boardId`. (`useMemo` cũng được, nhưng ở đây là thừa.) Nhớ thêm cleanup chống race như bài 02.
</details>

### 04 — memo mà vẫn render lại · `src/labs/04-memo/CardPicker.tsx`
Có 2 thứ phá `memo`. Bật React DevTools › Components › ⚙ › "Highlight updates when components render".
<details><summary>Gợi ý</summary>

`memo` so sánh nông từng prop: `style={{...}}` và `onSelect={() => ...}` là tham chiếu mới mỗi render. Đưa style ra hằng ngoài component; cho `CardRow` gọi `onSelect(title)` để cha truyền thẳng `setSelected` (hàm set của useState luôn ổn định) — hoặc `useCallback`.
Câu hỏi thêm: nếu bật React Compiler thì bài này còn bug không?
</details>

### 05 — Context kéo cả cây render · `src/labs/05-context/ContextLab.tsx`
Hai vấn đề riêng: (1) Tick làm mọi consumer render lại; (2) Đổi theme làm cả `ToggleButton` render lại.
<details><summary>Gợi ý</summary>

(1) `value={{...}}` mới mỗi render → mọi consumer render lại. `useMemo` cho value (và `useCallback`/hàm ổn định cho toggle).
(2) Một context chứa cả dữ liệu hay đổi (`theme`) lẫn hàm không đổi (`toggle`) → tách thành 2 context: `ThemeStateContext` và `ThemeActionsContext` — giống `BoardStateContext`/`BoardDispatchContext` ở T3.3.
Vì sao `children` không render lại khi Provider render lại? (xem T5.4b)
</details>

### 06 — Lab crash vì getSnapshot · `src/labs/06-external-store/WindowSize.tsx`
<details><summary>Gợi ý</summary>

`getSnapshot` bị gọi nhiều lần, React so kết quả bằng `Object.is`. Trả object mới mỗi lần → React tưởng store luôn đổi → render vô hạn. Cache snapshot (chỉ tạo object mới khi width/height thực sự đổi), hoặc dùng 2 hook trả số nguyên thuỷ. Bonus: tham số thứ 3 `getServerSnapshot`.
</details>

### 07 — Bản nháp dính sang card khác · `src/labs/07-key-reset/KeyLab.tsx`
Cấm dùng `useEffect(() => setDraft(card.title), [card])` — thử viết nó trước để thấy vì sao tệ (render thừa, nháy giá trị cũ 1 khung hình, đè mất chữ đang gõ khi cha render lại).
<details><summary>Gợi ý</summary>

`useState(card.title)` chỉ dùng giá trị khởi tạo ở lần mount. Cùng vị trí + cùng loại component = React giữ state. `<CardEditor key={card.id} />` → đổi card là component mới, state mới.
</details>

### 08 — Reducer bấm không ăn · `src/labs/08-reducer/todoReducer.ts`
Có 4 bug: `push`, gán `todo.done`, `splice` (và `findIndex` trả `-1`!), `Math.random()` trong reducer.
<details><summary>Gợi ý</summary>

React bỏ qua render nếu reducer trả **cùng tham chiếu** (`Object.is`). Dùng spread/`map`/`filter`. Reducer phải thuần (StrictMode gọi nó 2 lần!) → sinh id ở event handler: `dispatch({ type: "added", id: crypto.randomUUID(), text })`.
</details>

### 09 — Đổi theme bị rớt kết nối · `src/labs/09-effect-event/ChatRoom.tsx`
Test truyền `notify` là arrow function mới mỗi render — xoá `theme` khỏi deps thôi là chưa đủ.
<details><summary>Gợi ý</summary>

"Kết nối phòng" là việc *phản ứng* theo `roomId`; "thông báo với theme hiện tại" là *sự kiện* — muốn đọc giá trị mới nhất nhưng không muốn nó gây chạy lại effect. `const onConnected = useEffectEvent(() => notify(..., theme))`, gọi trong effect, deps chỉ còn `[roomId, connect]`.
</details>

### 10 — Suspense kẹt mãi · `src/labs/10-use-promise/UserProfile.tsx`
<details><summary>Gợi ý</summary>

`use(fetchUser(id))` tạo promise mới mỗi render → suspend → resolve → render lại → promise mới… Cache promise **bên ngoài** component (Map theo `userId`, xem `src/api/promiseCache.ts`). Lưu ý: test truyền `fetchUser` riêng — cache nên gắn với `fetchUser` (vd. `WeakMap<fetchUser, Map<id, Promise>>`), hoặc truyền promise từ cha. Vì sao không dùng `useState`/`useMemo` trong chính `UserProfile` được? (gợi ý: state của component suspend lần đầu bị bỏ).
</details>

### 11 — Lỗi async lọt khỏi Error Boundary (🛠) · `src/labs/11-async-error/ReportLab.tsx`
Yêu cầu: lỗi của `load()` hiện ở fallback của boundary, "Thử lại" hoạt động, nút disabled khi đang tải.
<details><summary>Gợi ý</summary>

Boundary chỉ bắt lỗi ném ra **lúc render**. Bắt lỗi trong handler (`try/catch`), lưu vào state, rồi `if (error) throw error` trong thân component. (Mẹo khác: `setState(() => { throw error })`.) Bonus: viết hook `useAsyncError()` dùng lại được.
</details>

### 12 — Nút like phải chờ server (🛠) · `src/labs/12-optimistic/LikeButton.tsx`
<details><summary>Gợi ý</summary>

`const [optimisticLikes, addOptimistic] = useOptimistic(likes, (n) => n + 1)`. Trong `startTransition(async () => { addOptimistic(); try { const n = await sendLike(likes); startTransition(() => setLikes(n)) } catch { ... } })`. Optimistic chỉ sống trong lúc transition chạy — xong (dù lỗi) là tự quay về `likes` thật. `aria-busy` = `optimisticLikes !== likes`. Vì sao `setLikes` sau `await` phải bọc `startTransition` lần nữa?
</details>

---

## Bài mở rộng (không có test — tự kiểm bằng DevTools)

Làm trên app TaskFlow chính:

- **E1 · React Compiler:** bật compiler (T5.7) rồi chạy lại lab 04 & 05 — test nào tự xanh? Vì sao lab 05 phần (2) vẫn đỏ?
- **E2 · `useTransition` cho bộ lọc:** ở `BoardPage`, lọc 5.000 card (`npm run api:big`) khi tick label bị giật. Bọc cập nhật URL của `FilterPanel` trong `startTransition`, làm mờ board khi `isPending`. So sánh với `useDeferredValue`.
- **E3 · Ref callback cleanup (React 19):** viết `useAutoHeight()` trả về ref callback dùng `ResizeObserver`, **trả về hàm cleanup** từ ref callback (tính năng mới React 19) thay cho `useEffect`.
- **E4 · `useActionState` cho đổi tên card:** thay `InlineEdit` + `renameCard` bằng `<form action>`; hiện lỗi server ngay dưới ô.
- **E5 · Huỷ optimistic khi rời board:** đang kéo card (API delay 3s) thì chuyển board — chuyện gì xảy ra với toast/focus? Sửa cho gọn.
- **E6 · Bug thật trong app:** `useKeyboardShortcut("n")` vẫn mở form khi đang xem modal chi tiết card. Sửa để phím tắt tắt khi có bất kỳ modal nào đang mở (gợi ý: `modalStack` trong `Modal.tsx`, hoặc một context "overlay").
