import type { Comment } from "../types";
import { request } from "./client";

export function getComments(cardId: string, signal?: AbortSignal) {
  return request<Comment[]>(
    `/comments?cardId=${encodeURIComponent(cardId)}`,
    { signal },
  );
}

export function addComment(input: Omit<Comment, "id">) {
  return request<Comment>("/comments", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
