import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
};

/**
 * Theme toggle is disabled in dark-only mode.
 * Renders nothing to maintain layout compatibility.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  return null;
}

