import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-button px-4 text-sm font-medium transition-colors duration-250 ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-b from-primary to-primary/85 text-primary-foreground shadow-[0_1px_2px_rgba(15,23,42,0.08)] transition-all duration-250 ease-premium hover:-translate-y-px hover:shadow-[0_8px_24px_rgba(79,124,255,0.35)] active:translate-y-0 active:shadow-[0_1px_2px_rgba(15,23,42,0.08)] disabled:hover:translate-y-0 disabled:hover:shadow-none",
        secondary:
          "border border-border bg-secondary text-secondary-foreground hover:border-[var(--border-hover)] hover:bg-accent",
        ghost:
          "bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        danger:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        icon: "size-12 rounded-button border border-border bg-card text-foreground hover:bg-accent",
      },
      size: {
        default: "h-12 px-4",
        sm: "h-10 px-3 text-sm",
        lg: "h-14 px-6 text-base",
        icon: "size-12 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);
