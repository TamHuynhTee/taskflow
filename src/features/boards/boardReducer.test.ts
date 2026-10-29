import { describe, expect, test } from "vitest";
import { makeCard } from "../../test/factories";
import type { Card } from "../../types";
import { boardReducer, type BoardAction } from "./boardReducer";

const a = makeCard({ id: "a", order: 0 });
const b = makeCard({ id: "b", order: 1, columnId: "doing" });
const other = makeCard({ id: "x", boardId: "b2" });
const state: Card[] = Object.freeze([a, b, other]) as Card[];

describe("boardReducer", () => {
  test("loaded thay card của đúng board", () => {
    const fresh = makeCard({ id: "n" });
    const next = boardReducer(state, { type: "loaded", boardId: "b1", cards: [fresh] });
    expect(next.map((c) => c.id)).toEqual(["x", "n"]);
  });

  test("added thêm vào cuối", () => {
    const card = makeCard({ id: "z" });
    expect(boardReducer(state, { type: "added", card }).at(-1)).toBe(card);
  });

  test("replaced thay đúng card", () => {
    const card = { ...a, title: "Mới" };
    expect(boardReducer(state, { type: "replaced", card })[0]).toBe(card);
  });

  test("deleted xoá theo id", () => {
    expect(boardReducer(state, { type: "deleted", id: "a" }).map((c) => c.id)).toEqual(["b", "x"]);
  });

  test("renamed đổi tiêu đề", () => {
    expect(boardReducer(state, { type: "renamed", id: "a", title: "T" })[0].title).toBe("T");
  });

  test("moved đổi cột và xếp cuối cột đích", () => {
    const moved = boardReducer(state, { type: "moved", id: "a", toColumnId: "doing" })[0];
    expect(moved).toMatchObject({ columnId: "doing", order: 2 });
  });

  test("priorityBumped tăng 1 bậc", () => {
    expect(boardReducer(state, { type: "priorityBumped", id: "a" })[0].priority).toBe("high");
  });

  test.each<BoardAction>([
    { type: "deleted", id: "a" },
    { type: "renamed", id: "a", title: "T" },
    { type: "moved", id: "a", toColumnId: "done" },
    { type: "priorityBumped", id: "a" },
  ])("không mutate state cũ: $type", (action) => {
    const next = boardReducer(state, action);
    expect(next).not.toBe(state);
    expect(state[0]).toBe(a);
    expect(a).toMatchObject({ title: "Card", columnId: "todo", priority: "medium" });
  });
});
