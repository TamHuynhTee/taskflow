// Display lookup tables for cards. Kept outside the component because they don't depend on props/state,
// so there's no need to recreate them every render.
import type { BadgeTone } from "../../components/Badge";
import type { CardFilter, CardFormValues, Label, Priority } from "../../types";

export const priorityMeta: Record<Priority, { text: string; tone: BadgeTone }> =
  {
    low: { text: "Low", tone: "neutral" },
    medium: { text: "Medium", tone: "blue" },
    high: { text: "High", tone: "orange" },
    urgent: { text: "Urgent", tone: "red" },
  };

export const labelMeta: Record<Label, { text: string; tone: BadgeTone }> = {
  bug: { text: "Bug", tone: "red" },
  feature: { text: "Feature", tone: "green" },
  design: { text: "Design", tone: "purple" },
  docs: { text: "Docs", tone: "blue" },
  chore: { text: "Chore", tone: "neutral" },
};

/** Empty filter = no filtering (T1.3). */
export const EMPTY_FILTER: CardFilter = {
  labels: [],
  priority: "all",
  assigneeId: "all",
};

/** Default values for the create-card form (T1.2). */
export const EMPTY_CARD_FORM: CardFormValues = {
  title: "",
  description: "",
  priority: "medium",
  labels: [],
  dueDate: "",
  assigneeId: "",
};

/** Checks whether a value read from FormData is a valid Priority. */
export function isPriority(value: unknown): value is Priority {
  return typeof value === "string" && value in priorityMeta;
}

export function isLabel(value: unknown): value is Label {
  return typeof value === "string" && value in labelMeta;
}
