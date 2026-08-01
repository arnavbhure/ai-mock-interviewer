import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import {
  THEME_STORAGE_KEY,
  ThemeContext,
  type Theme,
  type ThemeContextValue,
} from "@/contexts/theme-context";

type ThemeProviderProps = {
  children: ReactNode;
};

function getRouteTheme(pathname: string): Theme {
  return pathname.startsWith("/dashboard") || pathname.startsWith("/app") ? "dark" : "light";
}

function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") {
    return null;
  }

  const theme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return theme === "light" || theme === "dark" ? theme : null;
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const location = useLocation();
  const [userTheme, setUserTheme] = useState<Theme | null>(() => getStoredTheme());
  const theme = userTheme ?? getRouteTheme(location.pathname);
  const isUserPreference = userTheme !== null;

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback((nextTheme: Theme) => {
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    setUserTheme(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  const clearThemePreference = useCallback(() => {
    window.localStorage.removeItem(THEME_STORAGE_KEY);
    setUserTheme(null);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      clearThemePreference,
      isUserPreference,
    }),
    [clearThemePreference, isUserPreference, setTheme, theme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
