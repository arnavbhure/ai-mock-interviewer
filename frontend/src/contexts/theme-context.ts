import { createContext } from "react";

export type Theme = "light" | "dark";

export type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  clearThemePreference: () => void;
  isUserPreference: boolean;
};

export const THEME_STORAGE_KEY = "interviewai-theme";

export const ThemeContext = createContext<ThemeContextValue | null>(null);
