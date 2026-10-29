import type { Card, CardFormErrors, CardFormValues } from "../../types";
import { getDueStatus } from "../../utils/date";
import { EMPTY_CARD_FORM, isLabel, isPriority } from "./cardMeta";

/** Validates the create-card form (T1.2). No errors → `{}`. */
export function validateCardForm(
  values: CardFormValues,
  today: string,
): CardFormErrors {
  const errors: CardFormErrors = {};
  const title = values.title.trim();
  if (!title) errors.title = "Please enter a title";
  else if (title.length < 3) errors.title = "Title needs at least 3 characters";
  else if (title.length > 100) errors.title = "Title can be at most 100 characters";

  if (values.description.length > 500) {
    errors.description = "Description can be at most 500 characters";
  }
  if (values.dueDate && getDueStatus(values.dueDate, today) === "overdue") {
    errors.dueDate = "Due date can't be before today";
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

/** Reads an uncontrolled form's FormData into correctly typed CardFormValues. */
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
