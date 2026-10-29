// Các ô nhập liệu có label + thông báo lỗi.
// Mọi props còn lại (value, onChange, defaultValue, name, ref, ...) được chuyển thẳng xuống
// thẻ <input>/<select>/<textarea>, nên dùng được cả kiểu controlled lẫn uncontrolled.
// Từ React 19, `ref` cũng là một prop thường nên `...rest` truyền luôn ref xuống input (T3.5).
//
// T3.6: hiện `id` là BẮT BUỘC để nối <label htmlFor> với input. Nhiệm vụ của bạn là làm
// `id` thành tuỳ chọn, tự sinh bằng useId() khi không truyền vào.
import type { ComponentProps, ReactNode } from "react";

interface FieldShellProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

function FieldShell({ id, label, error, hint, children }: FieldShellProps) {
  return (
    <div className={`field ${error ? "field--invalid" : ""}`}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      {children}
      {error ? (
        <p className="field__error" id={`${id}-error`}>
          {error}
        </p>
      ) : (
        hint && (
          <p className="field__hint" id={`${id}-hint`}>
            {hint}
          </p>
        )
      )}
    </div>
  );
}

function describedBy(id: string, error?: string, hint?: string) {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

type BaseFieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
};

export function TextField({
  id,
  label,
  error,
  hint,
  ...rest
}: BaseFieldProps & ComponentProps<"input">) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <input
        {...rest}
        id={id}
        className="field__control"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
      />
    </FieldShell>
  );
}

export function TextAreaField({
  id,
  label,
  error,
  hint,
  ...rest
}: BaseFieldProps & ComponentProps<"textarea">) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <textarea
        rows={3}
        {...rest}
        id={id}
        className="field__control field__control--textarea"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
      />
    </FieldShell>
  );
}

export interface Option {
  value: string;
  label: string;
}

export function SelectField({
  id,
  label,
  error,
  hint,
  options,
  ...rest
}: BaseFieldProps & { options: Option[] } & ComponentProps<"select">) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <select
        {...rest}
        id={id}
        className="field__control"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

interface CheckboxGroupProps {
  id: string;
  label: string;
  name: string;
  options: Option[];
  /** Controlled: truyền value + onChange. Uncontrolled: truyền defaultValue (đọc bằng FormData.getAll(name)). */
  value?: string[];
  defaultValue?: string[];
  onChange?: (values: string[]) => void;
  error?: string;
}

export function CheckboxGroup({
  id,
  label,
  name,
  options,
  value,
  defaultValue,
  onChange,
  error,
}: CheckboxGroupProps) {
  return (
    <fieldset
      className={`field field--group ${error ? "field--invalid" : ""}`}
      aria-describedby={error ? `${id}-error` : undefined}
    >
      <legend className="field__label">{label}</legend>
      <div className="field__options">
        {options.map((o) => (
          <label key={o.value} className="checkbox">
            <input
              type="checkbox"
              name={name}
              value={o.value}
              checked={value ? value.includes(o.value) : undefined}
              defaultChecked={
                value ? undefined : defaultValue?.includes(o.value)
              }
              onChange={(e) => {
                if (!onChange || !value) return;
                onChange(
                  e.target.checked
                    ? [...value, o.value]
                    : value.filter((v) => v !== o.value),
                );
              }}
            />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p className="field__error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </fieldset>
  );
}
