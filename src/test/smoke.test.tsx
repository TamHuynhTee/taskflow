// Test mẫu chỉ để xác nhận Vitest + Testing Library chạy được. Test thật viết ở Level 6.
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import App from "../App";

test("App render tiêu đề", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: "TaskFlow" })).toBeInTheDocument();
});
