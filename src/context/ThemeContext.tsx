import { createContext, use, useEffect, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Theme } from "../types";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function systemTheme(): Theme {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useLocalStorage<Theme>(
    "taskflow.theme",
    systemTheme(),
  );

  // Đồng bộ ra "hệ thống bên ngoài" React: thuộc tính trên <html>.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // useMemo: value chỉ đổi khi theme đổi → consumer không render lại vô cớ khi Provider render lại (T5.4c).
  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    }),
    [theme, setTheme],
  );

  // React 19: dùng <Context> trực tiếp làm Provider.
  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme() {
  const ctx = use(ThemeContext);
  if (!ctx) throw new Error("useTheme phải dùng bên trong <ThemeProvider>");
  return ctx;
}
