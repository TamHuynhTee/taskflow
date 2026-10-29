import { act, fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { deferred } from "../testUtils";
import { CardSearch } from "./CardSearch";

test("a late old result must not overwrite the newer result", async () => {
  const requests = new Map<string, ReturnType<typeof deferred<string[]>>>();
  const search = vi.fn((q: string) => {
    const d = deferred<string[]>();
    requests.set(q, d);
    return d.promise;
  });

  render(<CardSearch search={search} />);
  const input = screen.getByLabelText("Search cards");
  fireEvent.change(input, { target: { value: "l" } });
  fireEvent.change(input, { target: { value: "lo" } });

  // "lo" arrives first, "l" arrives later.
  await act(async () => requests.get("lo")!.resolve(["login", "logo"]));
  await act(async () => requests.get("l")!.resolve(["layout", "login", "logo"]));

  const items = screen.getAllByRole("listitem").map((li) => li.textContent);
  expect(items).toEqual(["login", "logo"]);
});

test("clearing the search empties the list, even when an old request arrives later", async () => {
  const d = deferred<string[]>();
  render(<CardSearch search={() => d.promise} />);
  const input = screen.getByLabelText("Search cards");
  fireEvent.change(input, { target: { value: "lo" } });
  fireEvent.change(input, { target: { value: "" } });
  await act(async () => d.resolve(["login"]));
  expect(screen.queryAllByRole("listitem")).toHaveLength(0);
});
