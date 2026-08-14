import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid = false, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        "h-10 w-full rounded-input border bg-surface px-4 text-sm text-text placeholder:text-text-muted transition-colors duration-base ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:border-border-focus disabled:cursor-not-allowed disabled:opacity-50",
        invalid
          ? "border-error focus-visible:ring-error/30 focus-visible:border-error"
          : "border-border hover:border-border-hover",
        className,
      )}
      {...props}
    />
  );
});
