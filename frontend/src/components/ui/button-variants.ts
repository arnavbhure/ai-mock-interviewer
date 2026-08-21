import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-button px-4 text-sm font-medium transition-colors duration-base ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-primary-bright hover:shadow-[0_4px_12px_rgba(99,102,241,0.35)] active:bg-primary/90 active:shadow-none disabled:hover:bg-primary disabled:hover:shadow-[0_1px_2px_rgba(0,0,0,0.2)]",
        secondary:
          "border border-border bg-surface text-text hover:border-border-hover hover:bg-surface-elevated",
        ghost:
          "bg-transparent text-text-secondary hover:bg-surface hover:text-text",
        danger:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-border bg-transparent text-text hover:bg-surface hover:border-border-hover",
        icon: "size-10 rounded-button border border-border bg-surface text-text hover:bg-surface-elevated",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-9 px-3 text-sm",
        lg: "h-11 px-5 text-base",
        icon: "size-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);
