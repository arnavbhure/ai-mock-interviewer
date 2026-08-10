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
        "h-12 w-full rounded-input border bg-card px-4 text-sm text-foreground shadow-none transition-all duration-250 ease-premium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/25 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50",
        invalid
          ? "border-destructive/70 focus-visible:ring-destructive/20 focus-visible:border-destructive"
          : "border-input hover:border-[var(--border-hover)]",
        className,
      )}
      {...props}
    />
  );
});
