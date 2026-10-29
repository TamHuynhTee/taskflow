// Các ô nhập của form tạo/sửa card. KHÔNG chứa thẻ <form>, state, validate hay submit —
// đó là phần bạn viết trong CreateCardForm (T1.2, T4.3).
//
// Hai cách dùng:
//   • Controlled (T1.2 bản 1): truyền `values` + `onFieldChange`.
//   • Uncontrolled (T1.2 bản 2, T4.3): truyền `defaultValues` (hoặc không truyền gì), rồi đọc bằng
//     new FormData(form): get('title'), get('description'), get('priority'), getAll('labels'),
//     get('dueDate'), get('assigneeId').
import type { ReactNode, Ref } from "react";
import {
  CheckboxGroup,
  SelectField,
  TextAreaField,
  TextField,
} from "../../components/ui";
import type { CardFormErrors, CardFormValues, Label, User } from "../../types";
import { EMPTY_CARD_FORM, labelMeta, priorityMeta } from "./cardMeta";
import "./cardViews.css";

interface CardFormFieldsProps {
  users: User[];
  errors?: CardFormErrors;
  values?: CardFormValues;
  onFieldChange?: <K extends keyof CardFormValues>(
    field: K,
    value: CardFormValues[K],
  ) => void;
  defaultValues?: Partial<CardFormValues>;
  /** Ref tới ô tiêu đề — để tự focus khi mở form (T2.3). */
  titleRef?: Ref<HTMLInputElement>;
  /** Tiền tố id cho các ô. Đổi khi render 2 form cùng lúc. T3.6 sẽ thay bằng useId(). */
  idPrefix?: string;
}

const priorityOptions = Object.entries(priorityMeta).map(([value, m]) => ({
  value,
  label: m.text,
}));
const labelOptions = Object.entries(labelMeta).map(([value, m]) => ({
  value,
  label: m.text,
}));

export function CardFormFields({
  users,
  errors = {},
  values,
  onFieldChange,
  defaultValues,
  titleRef,
  idPrefix = "card-form",
}: CardFormFieldsProps) {
  // Controlled khi có `values`: mỗi ô nhận value + onChange. Ngược lại dùng defaultValue.
  const bind = <
    K extends "title" | "description" | "priority" | "dueDate" | "assigneeId",
  >(
    field: K,
  ) =>
    values
      ? {
          value: values[field],
          onChange: (e: { target: { value: string } }) =>
            onFieldChange?.(field, e.target.value as CardFormValues[K]),
        }
      : { defaultValue: defaultValues?.[field] ?? EMPTY_CARD_FORM[field] };

  return (
    <div className="card-form">
      <TextField
        id={`${idPrefix}-title`}
        label="Tiêu đề *"
        name="title"
        placeholder="Vd: Sửa lỗi trang đăng nhập"
        ref={titleRef}
        error={errors.title}
        {...bind("title")}
      />
      <TextAreaField
        id={`${idPrefix}-description`}
        label="Mô tả"
        name="description"
        error={errors.description}
        {...bind("description")}
      />
      <div className="card-form__row">
        <SelectField
          id={`${idPrefix}-priority`}
          label="Độ ưu tiên"
          name="priority"
          options={priorityOptions}
          error={errors.priority}
          {...bind("priority")}
        />
        <TextField
          id={`${idPrefix}-dueDate`}
          label="Hạn chót"
          name="dueDate"
          type="date"
          error={errors.dueDate}
          {...bind("dueDate")}
        />
      </div>
      <SelectField
        id={`${idPrefix}-assigneeId`}
        label="Giao cho"
        name="assigneeId"
        options={[
          { value: "", label: "— Chưa giao —" },
          ...users.map((u) => ({ value: u.id, label: u.name })),
        ]}
        error={errors.assigneeId}
        {...bind("assigneeId")}
      />
      <CheckboxGroup
        id={`${idPrefix}-labels`}
        label="Label"
        name="labels"
        options={labelOptions}
        error={errors.labels}
        value={values?.labels}
        onChange={(labels) => onFieldChange?.("labels", labels as Label[])}
        defaultValue={defaultValues?.labels}
      />
    </div>
  );
}

/** Hàng nút cuối form (đặt Huỷ / Lưu vào). */
export function FormActions({ children }: { children: ReactNode }) {
  return <div className="form-actions">{children}</div>;
}

/** Thông báo chung của form: lỗi server, "Đã lưu"... */
export function FormMessage({
  tone = "error",
  children,
}: {
  tone?: "error" | "success";
  children: ReactNode;
}) {
  return (
    <p
      className={`form-message form-message--${tone}`}
      role={tone === "error" ? "alert" : "status"}
    >
      {children}
    </p>
  );
}
