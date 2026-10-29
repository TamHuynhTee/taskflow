import { act, fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { deferred } from "../testUtils";
import { ReportLab } from "./ReportLab";

test("an async error shows in the ErrorBoundary and can be retried", async () => {
  vi.spyOn(console, "error").mockImplementation(() => {}); // React logs caught errors
  const first = deferred<string>();
  const load = vi
    .fn<() => Promise<string>>()
    .mockReturnValueOnce(first.promise)
    .mockResolvedValueOnce("OK");

  render(<ReportLab load={load} />);
  fireEvent.click(screen.getByRole("button", { name: "Load report" }));
  expect(screen.getByRole("button", { name: "Load report" })).toBeDisabled();

  await act(async () => first.reject(new Error("Server returned 500")));
  expect(screen.getByRole("alert")).toHaveTextContent("Error: Server returned 500");

  fireEvent.click(screen.getByRole("button", { name: "Retry" }));
  fireEvent.click(screen.getByRole("button", { name: "Load report" }));
  expect(await screen.findByText("Report: OK")).toBeInTheDocument();
});
