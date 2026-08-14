import { createContext } from "react";

export type Theme = "dark";

export type ThemeContextValue = {
  theme: Theme;
  // These functions exist for API compatibility but do nothing
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  clearThemePreference: () => void;
  isUserPreference: boolean;
};

export const THEME_STORAGE_KEY = "interviewai-theme";

export const ThemeContext = createContext<ThemeContextValue | null>(null);
