import type { Card, CardFormErrors, CardFormValues } from "../../types";
import { getDueStatus } from "../../utils/date";
import { EMPTY_CARD_FORM, isLabel, isPriority } from "./cardMeta";

/** Validate form tạo card (T1.2). Không lỗi → `{}`. */
export function validateCardForm(
  values: CardFormValues,
  today: string,
): CardFormErrors {
  const errors: CardFormErrors = {};
  const title = values.title.trim();
  if (!title) errors.title = "Vui lòng nhập tiêu đề";
  else if (title.length < 3) errors.title = "Tiêu đề tối thiểu 3 ký tự";
  else if (title.length > 100) errors.title = "Tiêu đề tối đa 100 ký tự";

  if (values.description.length > 500) {
    errors.description = "Mô tả tối đa 500 ký tự";
  }
  if (values.dueDate && getDueStatus(values.dueDate, today) === "overdue") {
    errors.dueDate = "Hạn chót không được trước hôm nay";
  }
  return errors;
}

export function createCardFromForm(
  values: CardFormValues,
  boardId: string,
  order: number,
): Omit<Card, "id"> {
  return {
    boardId,
    columnId: "todo",
    title: values.title.trim(),
    description: values.description.trim(),
    labels: values.labels,
    priority: values.priority,
    dueDate: values.dueDate || null,
    assigneeId: values.assigneeId || null,
    order,
    createdAt: new Date().toISOString(),
  };
}

/** Đọc FormData của form uncontrolled thành CardFormValues đúng kiểu. */
export function readCardForm(formData: FormData): CardFormValues {
  const text = (name: string) => {
    const v = formData.get(name);
    return typeof v === "string" ? v : "";
  };
  const priority = formData.get("priority");
  return {
    title: text("title"),
    description: text("description"),
    priority: isPriority(priority) ? priority : EMPTY_CARD_FORM.priority,
    labels: formData.getAll("labels").filter(isLabel),
    dueDate: text("dueDate"),
    assigneeId: text("assigneeId"),
  };
}
