import type { Card } from "../types";
import { request } from "./client";

export function getCards(boardId: string, signal?: AbortSignal) {
  return request<Card[]>(`/cards?boardId=${encodeURIComponent(boardId)}`, {
    signal,
  });
}

/** Toàn bộ card mọi board — trang Stats (T4.7). */
export function getAllCards(signal?: AbortSignal) {
  return request<Card[]>("/cards", { signal });
}

export function createCard(input: Omit<Card, "id">) {
  return request<Card>("/cards", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateCard(id: string, patch: Partial<Card>) {
  return request<Card>(`/cards/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export async function deleteCard(id: string): Promise<void> {
  await request<unknown>(`/cards/${id}`, { method: "DELETE" });
}
