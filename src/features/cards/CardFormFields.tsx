// Inputs for the create/edit card form. NO <form> tag, state, validation or submit —
// those are yours to write in CreateCardForm (T1.2, T4.3).
//
// Two ways to use it:
//   • Controlled (T1.2 version 1): pass `values` + `onFieldChange`.
//   • Uncontrolled (T1.2 version 2, T4.3): pass `defaultValues` (or nothing), then read with
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
  /** Ref to the title field — to focus it when the form opens (T2.3). */
  titleRef?: Ref<HTMLInputElement>;
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
}: CardFormFieldsProps) {
  // Controlled when `values` is given: each field gets value + onChange. Otherwise defaultValue.
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
        label="Title *"
        name="title"
        placeholder="E.g. Fix the login page"
        ref={titleRef}
        error={errors.title}
        {...bind("title")}
      />
      <TextAreaField
        label="Description"
        name="description"
        error={errors.description}
        {...bind("description")}
      />
      <div className="card-form__row">
        <SelectField
          label="Priority"
          name="priority"
          options={priorityOptions}
          error={errors.priority}
          {...bind("priority")}
        />
        <TextField
          label="Due date"
          name="dueDate"
          type="date"
          error={errors.dueDate}
          {...bind("dueDate")}
        />
      </div>
      <SelectField
        label="Assignee"
        name="assigneeId"
        options={[
          { value: "", label: "— Unassigned —" },
          ...users.map((u) => ({ value: u.id, label: u.name })),
        ]}
        error={errors.assigneeId}
        {...bind("assigneeId")}
      />
      <CheckboxGroup
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

/** Button row at the bottom of the form (put Cancel / Save in it). */
export function FormActions({ children }: { children: ReactNode }) {
  return <div className="form-actions">{children}</div>;
}

/** General form message: server error, "Saved"... */
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
