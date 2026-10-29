// LAB 05 — Context re-renders the whole tree
// 🐞 Click "Tick" (state unrelated to the theme) → ThemeLabel and ToggleButton both re-render.
//    Click "Toggle theme" → ToggleButton (which only needs the toggle function) re-renders too.
// Goal: Tick → no consumer re-renders; Toggle theme → only ThemeLabel re-renders.
// Keep as is: the `ContextLab` export, `renderLog`, the "Tick" button, the "Toggle theme" button, the "Theme: light|dark" text.
// Don't use memo() on the consumers — fix it on the Provider/context side.
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
  if (!ctx) throw new Error("Missing ThemeProvider");
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
  return <button onClick={toggle}>Toggle theme</button>;
}

export function ContextLab() {
  return (
    <ThemeProvider>
      <ThemeLabel />
      <ToggleButton />
    </ThemeProvider>
  );
}
