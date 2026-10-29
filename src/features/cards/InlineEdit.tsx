interface InlineEditProps {
  defaultValue: string;
  /** Gọi khi bấm Enter hoặc click ra ngoài, với giá trị đã trim. */
  onCommit: (value: string) => void;
  /** Gọi khi bấm Esc. */
  onCancel: () => void;
  label?: string;
}

/**
 * Ô sửa tiêu đề tại chỗ (T1.1). Bạn quản lý state "card nào đang được sửa" và
 * cập nhật dữ liệu trong onCommit; component này chỉ lo phần nhập và phím tắt.
 */
export function InlineEdit({
  defaultValue,
  onCommit,
  onCancel,
  label = "Sửa tiêu đề",
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
