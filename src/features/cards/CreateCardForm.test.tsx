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

test("invalid submit → shows an error under the title field and doesn't call the API", async () => {
  const user = userEvent.setup();
  setup();
  const title = await screen.findByLabelText("Title *", {}, { timeout: 3000 });
  expect(title).toHaveFocus();
  await user.type(title, "ab");
  await user.click(screen.getByRole("button", { name: "Create card" }));
  expect(await screen.findByText("Title needs at least 3 characters", {}, { timeout: 3000 })).toBeInTheDocument();
  // The form resets after the action but keeps the typed text thanks to defaultValues.
  expect(screen.getByLabelText("Title *")).toHaveValue("ab");
  expect(fetchMock).not.toHaveBeenCalledWith(expect.stringMatching(/\/cards$/), expect.anything());
});

test("valid submit → POSTs the card and puts it in the store", async () => {
  const user = userEvent.setup();
  const onCreated = setup();
  await user.type(await screen.findByLabelText("Title *", {}, { timeout: 3000 }), "Write tests");
  await user.selectOptions(screen.getByLabelText("Assignee"), "u1");
  await user.click(screen.getByRole("checkbox", { name: "Bug" }));
  await user.click(screen.getByRole("button", { name: "Create card" }));

  expect(await screen.findByText("1 card", {}, { timeout: 3000 })).toBeInTheDocument();
  expect(onCreated).toHaveBeenCalledWith(
    expect.objectContaining({ id: "new", title: "Write tests", assigneeId: "u1", labels: ["bug"], columnId: "todo" }),
  );
});
