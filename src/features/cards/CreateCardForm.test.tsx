import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test, vi } from "vitest";
import { BoardProvider, useBoardState } from "../../context/BoardContext";
import { CreateCardForm } from "./CreateCardForm";

const users = [{ id: "u1", name: "An", avatarColor: "#f00" }];
const fetchMock = vi.spyOn(globalThis, "fetch");

beforeEach(() => {
  fetchMock.mockReset();
  fetchMock.mockImplementation(async (input, init) => {
    const url = String(input);
    if (url.endsWith("/boards")) return Response.json([]);
    if (url.endsWith("/users")) return Response.json(users);
    if (url.endsWith("/cards") && init?.method === "POST") {
      return Response.json({ id: "new", ...JSON.parse(String(init.body)) });
    }
    return new Response("not found", { status: 404 });
  });
});

function CardCount() {
  return <p>{useBoardState().cards.length} card</p>;
}

function setup(onCreated = vi.fn()) {
  render(
    <BoardProvider>
      <CreateCardForm boardId="b1" today="2026-10-29" onCreated={onCreated} onCancel={() => {}} />
      <CardCount />
    </BoardProvider>,
  );
  return onCreated;
}

test("submit sai → hiện lỗi dưới ô tiêu đề và không gọi API", async () => {
  const user = userEvent.setup();
  setup();
  const title = await screen.findByLabelText("Tiêu đề *", {}, { timeout: 3000 });
  expect(title).toHaveFocus();
  await user.type(title, "ab");
  await user.click(screen.getByRole("button", { name: "Tạo card" }));
  expect(await screen.findByText("Tiêu đề tối thiểu 3 ký tự", {}, { timeout: 3000 })).toBeInTheDocument();
  // Form tự reset sau action nhưng giữ lại chữ đã gõ nhờ defaultValues.
  expect(screen.getByLabelText("Tiêu đề *")).toHaveValue("ab");
  expect(fetchMock).not.toHaveBeenCalledWith(expect.stringMatching(/\/cards$/), expect.anything());
});

test("submit đúng → POST card và đưa vào store", async () => {
  const user = userEvent.setup();
  const onCreated = setup();
  await user.type(await screen.findByLabelText("Tiêu đề *", {}, { timeout: 3000 }), "Viết test");
  await user.selectOptions(screen.getByLabelText("Giao cho"), "u1");
  await user.click(screen.getByRole("checkbox", { name: "Bug" }));
  await user.click(screen.getByRole("button", { name: "Tạo card" }));

  expect(await screen.findByText("1 card", {}, { timeout: 3000 })).toBeInTheDocument();
  expect(onCreated).toHaveBeenCalledWith(
    expect.objectContaining({ id: "new", title: "Viết test", assigneeId: "u1", labels: ["bug"], columnId: "todo" }),
  );
});
