// LAB 05 — Context làm render lại cả cây
// 🐞 Bấm "Tick" (state không liên quan tới theme) → ThemeLabel và ToggleButton đều render lại.
//    Bấm "Đổi theme" → ToggleButton (chỉ cần hàm toggle) cũng render lại.
// Mục tiêu: Tick → không consumer nào render lại; Đổi theme → chỉ ThemeLabel render lại.
// Giữ nguyên: export `ContextLab`, `renderLog`, nút "Tick", nút "Đổi theme", chữ "Theme: light|dark".
// Không dùng memo() cho consumer — sửa ở phía Provider/context.
import { createContext, use, useState, type ReactNode } from "react";

export const renderLog: string[] = [];

type Theme = "light" | "dark";
interface ThemeValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeValue | null>(null);

function useThemeValue() {
  const ctx = use(ThemeContext);
  if (!ctx) throw new Error("Thiếu ThemeProvider");
  return ctx;
}

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [ticks, setTicks] = useState(0);

  const value = {
    theme,
    toggle: () => setTheme((t) => (t === "light" ? "dark" : "light")),
  };

  return (
    <ThemeContext value={value}>
      <button onClick={() => setTicks((n) => n + 1)}>Tick</button>
      <small> {ticks} tick</small>
      {children}
    </ThemeContext>
  );
}

function ThemeLabel() {
  renderLog.push("ThemeLabel");
  const { theme } = useThemeValue();
  return <p>Theme: {theme}</p>;
}

function ToggleButton() {
  renderLog.push("ToggleButton");
  const { toggle } = useThemeValue();
  return <button onClick={toggle}>Đổi theme</button>;
}

export function ContextLab() {
  return (
    <ThemeProvider>
      <ThemeLabel />
      <ToggleButton />
    </ThemeProvider>
  );
}
