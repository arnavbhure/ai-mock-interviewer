import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type PasswordToggleProps = {
  showPassword: boolean;
  onToggle: () => void;
  className?: string;
};

export function PasswordToggle({
  showPassword,
  onToggle,
  className,
}: PasswordToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={showPassword ? "Hide password" : "Show password"}
      aria-pressed={showPassword}
      className={cn(
        "absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors duration-250 ease-premium hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={showPassword ? "off" : "on"}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex"
        >
          {showPassword ? (
            <EyeOff size={18} strokeWidth={1.75} />
          ) : (
            <Eye size={18} strokeWidth={1.75} />
          )}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
