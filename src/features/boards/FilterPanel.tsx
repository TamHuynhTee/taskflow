import { Button, CheckboxGroup, SelectField } from "../../components/ui";
import "./boardWidgets.css";
import type { CardFilter, Label, Priority, User } from "../../types";
import { EMPTY_FILTER, labelMeta, priorityMeta } from "../cards/cardMeta";

interface FilterPanelProps {
  /** Controlled: state bộ lọc do component cha giữ (T1.3). */
  value: CardFilter;
  onChange: (next: CardFilter) => void;
  users: User[];
}

const labelOptions = Object.entries(labelMeta).map(([value, m]) => ({
  value,
  label: m.text,
}));
const priorityOptions = [
  { value: "all", label: "Tất cả" },
  ...Object.entries(priorityMeta).map(([value, m]) => ({
    value,
    label: m.text,
  })),
];

/** Chỉ hiển thị + báo thay đổi. Việc lọc card theo `value` là phần bạn làm (T1.3). */
export function FilterPanel({ value, onChange, users }: FilterPanelProps) {
  const isEmpty =
    value.labels.length === 0 &&
    value.priority === "all" &&
    value.assigneeId === "all";

  return (
    <div className="filter-panel">
      <CheckboxGroup
        id="filter-labels"
        label="Label"
        name="labels"
        options={labelOptions}
        value={value.labels}
        onChange={(labels) => onChange({ ...value, labels: labels as Label[] })}
      />
      <SelectField
        id="filter-priority"
        label="Độ ưu tiên"
        options={priorityOptions}
        value={value.priority}
        onChange={(e) =>
          onChange({ ...value, priority: e.target.value as Priority | "all" })
        }
      />
      <SelectField
        id="filter-assignee"
        label="Người được giao"
        options={[
          { value: "all", label: "Tất cả" },
          ...users.map((u) => ({ value: u.id, label: u.name })),
        ]}
        value={value.assigneeId}
        onChange={(e) => onChange({ ...value, assigneeId: e.target.value })}
      />
      <Button
        size="sm"
        variant="ghost"
        disabled={isEmpty}
        onClick={() => onChange(EMPTY_FILTER)}
      >
        Xoá bộ lọc
      </Button>
    </div>
  );
}
