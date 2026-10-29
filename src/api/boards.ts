import type { Board, User } from "../types";
import { request } from "./client";

export function getBoards(signal?: AbortSignal) {
  return request<Board[]>("/boards", { signal });
}

export function getUsers(signal?: AbortSignal) {
  return request<User[]>("/users", { signal });
}
