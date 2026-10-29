import { describe, expect, test } from "vitest";
import { EMPTY_CARD_FORM } from "./cardMeta";
import { createCardFromForm, readCardForm, validateCardForm } from "./cardForm";

const today = "2026-10-29";

describe("validateCardForm", () => {
  test("valid → {}", () => {
    expect(validateCardForm({ ...EMPTY_CARD_FORM, title: "Fix bug" }, today)).toEqual({});
  });

  test("title is required, trimmed, 3–100 characters", () => {
    expect(validateCardForm({ ...EMPTY_CARD_FORM, title: "   " }, today).title).toBeDefined();
    expect(validateCardForm({ ...EMPTY_CARD_FORM, title: " ab " }, today).title).toBeDefined();
    expect(validateCardForm({ ...EMPTY_CARD_FORM, title: "x".repeat(101) }, today).title).toBeDefined();
  });

  test("description ≤ 500, due date not before today", () => {
    const errors = validateCardForm(
      { ...EMPTY_CARD_FORM, title: "Valid", description: "x".repeat(501), dueDate: "2026-10-28" },
      today,
    );
    expect(Object.keys(errors).sort()).toEqual(["description", "dueDate"]);
    expect(validateCardForm({ ...EMPTY_CARD_FORM, title: "Valid", dueDate: today }, today)).toEqual({});
  });
});

test("readCardForm coerces types and drops unknown values", () => {
  const fd = new FormData();
  fd.set("title", "A");
  fd.set("priority", "super urgent");
  fd.append("labels", "bug");
  fd.append("labels", "hack");
  expect(readCardForm(fd)).toEqual({
    ...EMPTY_CARD_FORM,
    title: "A",
    labels: ["bug"],
  });
});

test("createCardFromForm: empty strings → null, todo column", () => {
  const card = createCardFromForm({ ...EMPTY_CARD_FORM, title: " T " }, "b1", 3);
  expect(card).toMatchObject({ boardId: "b1", columnId: "todo", title: "T", dueDate: null, assigneeId: null, order: 3 });
});
