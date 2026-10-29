import type { ComponentType } from "react";
import { Stopwatch } from "./01-stale-closure/Stopwatch";
import { CardSearch } from "./02-race-condition/CardSearch";
import { BoardCards } from "./03-object-deps/BoardCards";
import { CardPicker } from "./04-memo/CardPicker";
import { ContextLab } from "./05-context/ContextLab";
import { WindowSize } from "./06-external-store/WindowSize";
import { KeyLab } from "./07-key-reset/KeyLab";
import { TodoLab } from "./08-reducer/TodoLab";
import { ChatRoomDemo } from "./09-effect-event/ChatRoomDemo";
import { UseLab } from "./10-use-promise/UserProfile";
import { ReportLab } from "./11-async-error/ReportLab";
import { LikeButton } from "./12-optimistic/LikeButton";

export interface Lab {
  id: string;
  title: string;
  concept: string;
  kind: "bug" | "implement";
  file: string;
  Demo: ComponentType;
}

export const LABS: Lab[] = [
  { id: "01", title: "Đồng hồ đứng im", concept: "Stale closure, updater function", kind: "bug", file: "01-stale-closure/Stopwatch.tsx", Demo: Stopwatch },
  { id: "02", title: "Kết quả tìm kiếm nhảy lung tung", concept: "Race condition, cleanup của effect", kind: "bug", file: "02-race-condition/CardSearch.tsx", Demo: CardSearch },
  { id: "03", title: "Fetch không bao giờ dừng", concept: "Referential equality trong deps", kind: "bug", file: "03-object-deps/BoardCards.tsx", Demo: () => <BoardCards boardId="b1" /> },
  { id: "04", title: "memo mà vẫn render lại", concept: "memo, useCallback, props ổn định", kind: "bug", file: "04-memo/CardPicker.tsx", Demo: CardPicker },
  { id: "05", title: "Context kéo cả cây render", concept: "Context value, tách context", kind: "bug", file: "05-context/ContextLab.tsx", Demo: ContextLab },
  { id: "06", title: "Màn hình trắng vì getSnapshot", concept: "useSyncExternalStore", kind: "bug", file: "06-external-store/WindowSize.tsx", Demo: WindowSize },
  { id: "07", title: "Bản nháp dính sang card khác", concept: "Reset state bằng key", kind: "bug", file: "07-key-reset/KeyLab.tsx", Demo: KeyLab },
  { id: "08", title: "Reducer bấm không ăn", concept: "Immutability, reducer thuần", kind: "bug", file: "08-reducer/todoReducer.ts", Demo: TodoLab },
  { id: "09", title: "Đổi theme bị rớt kết nối", concept: "useEffectEvent", kind: "bug", file: "09-effect-event/ChatRoom.tsx", Demo: ChatRoomDemo },
  { id: "10", title: "Suspense kẹt mãi", concept: "use(promise), cache promise", kind: "bug", file: "10-use-promise/UserProfile.tsx", Demo: UseLab },
  { id: "11", title: "Lỗi async lọt khỏi Error Boundary", concept: "Error Boundary + async", kind: "implement", file: "11-async-error/ReportLab.tsx", Demo: ReportLab },
  { id: "12", title: "Nút like phải chờ server", concept: "useOptimistic, transition", kind: "implement", file: "12-optimistic/LikeButton.tsx", Demo: LikeButton },
];
