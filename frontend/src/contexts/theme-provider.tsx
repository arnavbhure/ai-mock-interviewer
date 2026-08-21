import { useCallback, useEffect, useMemo, type ReactNode } from "react";
import { ThemeContext, type Theme, type ThemeContextValue } from "@/contexts/theme-context";

type ThemeProviderProps = {
  children: ReactNode;
};

function applyTheme() {
  document.documentElement.classList.remove("dark");
  document.documentElement.dataset.theme = "light";
  document.documentElement.style.colorScheme = "light";
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme: Theme = "dark";

  useEffect(() => {
    applyTheme();
  }, []);

  // No-op functions for API compatibility
  const setTheme = useCallback(() => {
    // Dark only - no-op
  }, []);

  const toggleTheme = useCallback(() => {
    // Dark only - no-op
  }, []);

  const clearThemePreference = useCallback(() => {
    // Dark only - no-op
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      clearThemePreference,
      isUserPreference: false,
    }),
    [clearThemePreference, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
