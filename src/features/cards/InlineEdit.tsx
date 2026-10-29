interface InlineEditProps {
  defaultValue: string;
  /** Called on Enter or clicking outside, with the trimmed value. */
  onCommit: (value: string) => void;
  /** Called on Esc. */
  onCancel: () => void;
  label?: string;
}

/**
 * In-place title editor (T1.1). You manage the "which card is being edited" state and
 * update the data in onCommit; this component only handles input and shortcuts.
 */
export function InlineEdit({
  defaultValue,
  onCommit,
  onCancel,
  label = "Edit title",
}: InlineEditProps) {
  return (
    <input
      className="inline-edit"
      aria-label={label}
      defaultValue={defaultValue}
      autoFocus
      onFocus={(e) => e.currentTarget.select()}
      onBlur={(e) => onCommit(e.currentTarget.value.trim())}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
        if (e.key === "Escape") onCancel();
      }}
    />
  );
}
