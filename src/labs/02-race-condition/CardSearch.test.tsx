import { act, fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { deferred } from "../testUtils";
import { CardSearch } from "./CardSearch";

test("kết quả cũ về muộn không được ghi đè kết quả mới", async () => {
  const requests = new Map<string, ReturnType<typeof deferred<string[]>>>();
  const search = vi.fn((q: string) => {
    const d = deferred<string[]>();
    requests.set(q, d);
    return d.promise;
  });

  render(<CardSearch search={search} />);
  const input = screen.getByLabelText("Tìm card");
  fireEvent.change(input, { target: { value: "l" } });
  fireEvent.change(input, { target: { value: "lo" } });

  // "lo" về trước, "l" về sau.
  await act(async () => requests.get("lo")!.resolve(["login", "logo"]));
  await act(async () => requests.get("l")!.resolve(["layout", "login", "logo"]));

  const items = screen.getAllByRole("listitem").map((li) => li.textContent);
  expect(items).toEqual(["login", "logo"]);
});

test("xoá ô tìm kiếm thì danh sách trống, kể cả khi request cũ về sau", async () => {
  const d = deferred<string[]>();
  render(<CardSearch search={() => d.promise} />);
  const input = screen.getByLabelText("Tìm card");
  fireEvent.change(input, { target: { value: "lo" } });
  fireEvent.change(input, { target: { value: "" } });
  await act(async () => d.resolve(["login"]));
  expect(screen.queryAllByRole("listitem")).toHaveLength(0);
});
