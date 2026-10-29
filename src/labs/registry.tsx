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
  { id: "01", title: "The frozen stopwatch", concept: "Stale closure, updater function", kind: "bug", file: "01-stale-closure/Stopwatch.tsx", Demo: Stopwatch },
  { id: "02", title: "Search results jump around", concept: "Race condition, effect cleanup", kind: "bug", file: "02-race-condition/CardSearch.tsx", Demo: CardSearch },
  { id: "03", title: "The fetch that never stops", concept: "Referential equality in deps", kind: "bug", file: "03-object-deps/BoardCards.tsx", Demo: () => <BoardCards boardId="b1" /> },
  { id: "04", title: "memo, yet it still re-renders", concept: "memo, useCallback, stable props", kind: "bug", file: "04-memo/CardPicker.tsx", Demo: CardPicker },
  { id: "05", title: "Context drags the whole tree along", concept: "Context value, splitting contexts", kind: "bug", file: "05-context/ContextLab.tsx", Demo: ContextLab },
  { id: "06", title: "Blank screen from getSnapshot", concept: "useSyncExternalStore", kind: "bug", file: "06-external-store/WindowSize.tsx", Demo: WindowSize },
  { id: "07", title: "The draft sticks to another card", concept: "Resetting state with key", kind: "bug", file: "07-key-reset/KeyLab.tsx", Demo: KeyLab },
  { id: "08", title: "The reducer that ignores clicks", concept: "Immutability, pure reducers", kind: "bug", file: "08-reducer/todoReducer.ts", Demo: TodoLab },
  { id: "09", title: "Changing the theme drops the connection", concept: "useEffectEvent", kind: "bug", file: "09-effect-event/ChatRoom.tsx", Demo: ChatRoomDemo },
  { id: "10", title: "Suspense stuck forever", concept: "use(promise), caching promises", kind: "bug", file: "10-use-promise/UserProfile.tsx", Demo: UseLab },
  { id: "11", title: "Async errors slip past the Error Boundary", concept: "Error Boundary + async", kind: "implement", file: "11-async-error/ReportLab.tsx", Demo: ReportLab },
  { id: "12", title: "The like button waits for the server", concept: "useOptimistic, transitions", kind: "implement", file: "12-optimistic/LikeButton.tsx", Demo: LikeButton },
];
