import { act, fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { deferred } from "../testUtils";
import { ReportLab } from "./ReportLab";

test("lỗi async hiện ở ErrorBoundary và thử lại được", async () => {
  vi.spyOn(console, "error").mockImplementation(() => {}); // React log lỗi đã bắt
  const first = deferred<string>();
  const load = vi
    .fn<() => Promise<string>>()
    .mockReturnValueOnce(first.promise)
    .mockResolvedValueOnce("OK");

  render(<ReportLab load={load} />);
  fireEvent.click(screen.getByRole("button", { name: "Tải báo cáo" }));
  expect(screen.getByRole("button", { name: "Tải báo cáo" })).toBeDisabled();

  await act(async () => first.reject(new Error("Server trả về 500")));
  expect(screen.getByRole("alert")).toHaveTextContent("Lỗi: Server trả về 500");

  fireEvent.click(screen.getByRole("button", { name: "Thử lại" }));
  fireEvent.click(screen.getByRole("button", { name: "Tải báo cáo" }));
  expect(await screen.findByText("Báo cáo: OK")).toBeInTheDocument();
});
