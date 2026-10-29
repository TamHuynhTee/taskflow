import { expect, test } from "vitest";
import { makeCard } from "../../test/factories";
import { EMPTY_FILTER } from "../cards/cardMeta";
import { filterCards } from "./filterCards";

const cards = [
  makeCard({ id: "1", title: "Login page", labels: ["bug"], priority: "high", assigneeId: "u1" }),
  makeCard({ id: "2", title: "Docs", description: "Write the LOGIN guide", labels: ["docs"] }),
  makeCard({ id: "3", title: "Logo", labels: ["design", "bug"], assigneeId: "u2" }),
];
const ids = (cs: typeof cards) => cs.map((c) => c.id);

test("empty filter returns everything", () => {
  expect(ids(filterCards(cards, EMPTY_FILTER, ""))).toEqual(["1", "2", "3"]);
});

test("query is case-insensitive and also searches the description", () => {
  expect(ids(filterCards(cards, EMPTY_FILTER, "  login "))).toEqual(["1", "2"]);
});

test("labels: at least 1 label matches", () => {
  expect(ids(filterCards(cards, { ...EMPTY_FILTER, labels: ["design", "docs"] }, ""))).toEqual(["2", "3"]);
});

test("combines every condition", () => {
  const filter = { labels: ["bug" as const], priority: "high" as const, assigneeId: "u1" };
  expect(ids(filterCards(cards, filter, "log"))).toEqual(["1"]);
  expect(ids(filterCards(cards, { ...EMPTY_FILTER, assigneeId: "u2" }, "login"))).toEqual([]);
});
