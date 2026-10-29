// Inputs with a label + an error message.
// All remaining props (value, onChange, defaultValue, name, ref, ...) are passed straight down to
// the <input>/<select>/<textarea>, so they work both controlled and uncontrolled.
// Since React 19, `ref` is a regular prop too, so `...rest` passes the ref down to the input (T3.5).
//
// T3.6: `id` is optional — if omitted it's generated with useId(). useId gives an id that's stable across
// renders, unique in the page (two forms at once never clash) and matches between server/client with SSR.
// Don't use Math.random()/a global counter: a different id on every render, and a mismatch on hydration.
import { useId, type ComponentProps, type ReactNode } from "react";

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
  id?: string;
  label: string;
  error?: string;
  hint?: string;
};

export function TextField({
  id: idProp,
  label,
  error,
  hint,
  ...rest
}: BaseFieldProps & ComponentProps<"input">) {
  const autoId = useId();
  const id = idProp ?? autoId;
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
  id: idProp,
  label,
  error,
  hint,
  ...rest
}: BaseFieldProps & ComponentProps<"textarea">) {
  const autoId = useId();
  const id = idProp ?? autoId;
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
  id: idProp,
  label,
  error,
  hint,
  options,
  ...rest
}: BaseFieldProps & { options: Option[] } & ComponentProps<"select">) {
  const autoId = useId();
  const id = idProp ?? autoId;
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
  id?: string;
  label: string;
  name: string;
  options: Option[];
  /** Controlled: pass value + onChange. Uncontrolled: pass defaultValue (read with FormData.getAll(name)). */
  value?: string[];
  defaultValue?: string[];
  onChange?: (values: string[]) => void;
  error?: string;
}

export function CheckboxGroup({
  id: idProp,
  label,
  name,
  options,
  value,
  defaultValue,
  onChange,
  error,
}: CheckboxGroupProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
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
