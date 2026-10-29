import type { Card } from "../types";
import { getCards } from "./cards";
import { createPromiseCache } from "./promiseCache";

const cache = createPromiseCache<Card[]>((boardId) => getCards(boardId));

export const getCardsPromise = cache.get;
/** Call after every write so the next time the board opens it loads fresh data from the server. */
export const invalidateCards = cache.invalidate;
