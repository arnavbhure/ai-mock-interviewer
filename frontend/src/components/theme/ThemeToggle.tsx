import type { ComponentProps } from "react";

type ThemeToggleProps = ComponentProps<"button">;

/**
 * Theme toggle is disabled in dark-only mode.
 * Renders nothing to maintain layout compatibility.
 */
export function ThemeToggle(props: ThemeToggleProps) {
  void props;
  return null;
}
