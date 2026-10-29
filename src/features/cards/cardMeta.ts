// Bảng tra hiển thị cho card. Để ngoài component vì không phụ thuộc props/state,
// không cần tạo lại mỗi lần render.
import type { BadgeTone } from "../../components/Badge";
import type { CardFilter, CardFormValues, Label, Priority } from "../../types";

export const priorityMeta: Record<Priority, { text: string; tone: BadgeTone }> =
  {
    low: { text: "Thấp", tone: "neutral" },
    medium: { text: "Trung bình", tone: "blue" },
    high: { text: "Cao", tone: "orange" },
    urgent: { text: "Khẩn cấp", tone: "red" },
  };

export const labelMeta: Record<Label, { text: string; tone: BadgeTone }> = {
  bug: { text: "Bug", tone: "red" },
  feature: { text: "Feature", tone: "green" },
  design: { text: "Design", tone: "purple" },
  docs: { text: "Docs", tone: "blue" },
  chore: { text: "Chore", tone: "neutral" },
};

/** Bộ lọc rỗng = không lọc gì (T1.3). */
export const EMPTY_FILTER: CardFilter = {
  labels: [],
  priority: "all",
  assigneeId: "all",
};

/** Giá trị mặc định của form tạo card (T1.2). */
export const EMPTY_CARD_FORM: CardFormValues = {
  title: "",
  description: "",
  priority: "medium",
  labels: [],
  dueDate: "",
  assigneeId: "",
};

/** Kiểm tra giá trị đọc từ FormData có phải Priority hợp lệ không. */
export function isPriority(value: unknown): value is Priority {
  return typeof value === "string" && value in priorityMeta;
}

export function isLabel(value: unknown): value is Label {
  return typeof value === "string" && value in labelMeta;
}
