import type { Comment } from "../types";
import { getComments } from "./comments";
import { createPromiseCache } from "./promiseCache";

const cache = createPromiseCache<Comment[]>((cardId) => getComments(cardId));

export const getCommentsPromise = cache.get;
export const invalidateComments = cache.invalidate;
