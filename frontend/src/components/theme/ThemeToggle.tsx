import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const Icon = isDark ? Sun : Moon;

  return (
    <Button
      type="button"
      variant="icon"
      size="icon"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={toggleTheme}
      className={cn("border-transparent bg-transparent", className)}
    >
      <motion.span
        key={theme}
        aria-hidden="true"
        initial={{ opacity: 0, rotate: 90, scale: 0.9 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        exit={{ opacity: 0, rotate: -90, scale: 0.9 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      >
        <Icon size={20} strokeWidth={1.75} />
      </motion.span>
    </Button>
  );
}

