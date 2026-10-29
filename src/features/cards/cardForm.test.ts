import { describe, expect, test } from "vitest";
import { EMPTY_CARD_FORM } from "./cardMeta";
import { createCardFromForm, readCardForm, validateCardForm } from "./cardForm";

const today = "2026-10-29";

describe("validateCardForm", () => {
  test("hợp lệ → {}", () => {
    expect(validateCardForm({ ...EMPTY_CARD_FORM, title: "Sửa lỗi" }, today)).toEqual({});
  });

  test("title bắt buộc, trim, 3–100 ký tự", () => {
    expect(validateCardForm({ ...EMPTY_CARD_FORM, title: "   " }, today).title).toBeDefined();
    expect(validateCardForm({ ...EMPTY_CARD_FORM, title: " ab " }, today).title).toBeDefined();
    expect(validateCardForm({ ...EMPTY_CARD_FORM, title: "x".repeat(101) }, today).title).toBeDefined();
  });

  test("mô tả ≤ 500, hạn chót không trước hôm nay", () => {
    const errors = validateCardForm(
      { ...EMPTY_CARD_FORM, title: "Hợp lệ", description: "x".repeat(501), dueDate: "2026-10-28" },
      today,
    );
    expect(Object.keys(errors).sort()).toEqual(["description", "dueDate"]);
    expect(validateCardForm({ ...EMPTY_CARD_FORM, title: "Hợp lệ", dueDate: today }, today)).toEqual({});
  });
});

test("readCardForm ép kiểu và bỏ giá trị lạ", () => {
  const fd = new FormData();
  fd.set("title", "A");
  fd.set("priority", "siêu gấp");
  fd.append("labels", "bug");
  fd.append("labels", "hack");
  expect(readCardForm(fd)).toEqual({
    ...EMPTY_CARD_FORM,
    title: "A",
    labels: ["bug"],
  });
});

test("createCardFromForm: chuỗi rỗng → null, cột todo", () => {
  const card = createCardFromForm({ ...EMPTY_CARD_FORM, title: " T " }, "b1", 3);
  expect(card).toMatchObject({ boardId: "b1", columnId: "todo", title: "T", dueDate: null, assigneeId: null, order: 3 });
});
