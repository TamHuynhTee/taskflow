// LAB 05 — Context re-renders the whole tree
// 🐞 Click "Tick" (state unrelated to the theme) → ThemeLabel and ToggleButton both re-render.
//    Click "Toggle theme" → ToggleButton (which only needs the toggle function) re-renders too.
// Goal: Tick → no consumer re-renders; Toggle theme → only ThemeLabel re-renders.
// Keep as is: the `ContextLab` export, `renderLog`, the "Tick" button, the "Toggle theme" button, the "Theme: light|dark" text.
// Don't use memo() on the consumers — fix it on the Provider/context side.
import { createContext, use, useMemo, useState, type ReactNode } from "react";

export const renderLog: string[] = [];

type Theme = "light" | "dark";
interface ThemeAction {
  toggle: () => void;
}

const ThemeStateContext = createContext<Theme | null>(null);
const ThemeActionsContext = createContext<ThemeAction | null>(null);

function useTheme() {
  const ctx = use(ThemeStateContext);
  if (!ctx) throw new Error("Missing ThemeProvider");
  return ctx;
}

function useThemeActions() {
  const ctx = use(ThemeActionsContext);
  if (!ctx) throw new Error("Missing ThemeProvider");
  return ctx;
}

function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  const actions = useMemo(
    () => ({
      toggle: () => setTheme((th) => (th === "dark" ? "light" : "dark")),
    }),
    [setTheme],
  );

  return (
    <ThemeStateContext value={theme}>
      <ThemeActionsContext value={actions}>{children}</ThemeActionsContext>
    </ThemeStateContext>
  );
}

const TickButton = function TickButton() {
  const [ticks, setTicks] = useState(0);
  return (
    <>
      <button onClick={() => setTicks((n) => n + 1)}>Tick</button>
      <small> {ticks} tick</small>
    </>
  );
};

function ThemeLabel() {
  renderLog.push("ThemeLabel");
  const theme = useTheme();
  return <p>Theme: {theme}</p>;
}

function ToggleButton() {
  renderLog.push("ToggleButton");
  const { toggle } = useThemeActions();

  return <button onClick={toggle}>Toggle theme</button>;
}

export function ContextLab() {
  return (
    <>
      <TickButton />
      <ThemeProvider>
        <ThemeLabel />
        <ToggleButton />
      </ThemeProvider>
    </>
  );
}
