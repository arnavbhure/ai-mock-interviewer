import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { UseFormRegister } from "react-hook-form";
import { cn } from "@/lib/utils";
import type { LoginFormValues } from "@/types/auth.types";

type RememberMeProps = {
  register: UseFormRegister<LoginFormValues>;
};

export function RememberMe({ register }: RememberMeProps) {
  return (
    <label
      htmlFor="remember-me"
      className="group inline-flex cursor-pointer select-none items-center gap-3"
    >
      <motion.span
        whileTap={{ scale: 0.94 }}
        transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="relative inline-flex"
      >
        <input
          id="remember-me"
          type="checkbox"
          className="peer sr-only"
          {...register("rememberMe")}
        />
        <span
          className={cn(
            "flex size-5 items-center justify-center rounded-md border bg-card transition-colors duration-250 ease-premium",
            "border-input group-hover:border-[var(--border-hover)]",
            "peer-checked:border-primary peer-checked:bg-primary",
            "peer-checked:[&>svg]:opacity-100",
            "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
          )}
        >
          <Check
            size={14}
            strokeWidth={2.5}
            className="text-primary-foreground opacity-0 transition-opacity duration-250 ease-premium"
          />
        </span>
      </motion.span>
      <span className="text-sm text-secondary-foreground">Remember me</span>
    </label>
  );
}

