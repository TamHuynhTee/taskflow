import type { Card } from "../types";
import { getCards } from "./cards";
import { createPromiseCache } from "./promiseCache";

const cache = createPromiseCache<Card[]>((boardId) => getCards(boardId));

export const getCardsPromise = cache.get;
/** Gọi sau mỗi lần ghi để lần mở board sau tải dữ liệu mới từ server. */
export const invalidateCards = cache.invalidate;
