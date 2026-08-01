import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  "inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-button px-4 text-sm font-medium transition-colors duration-250 ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "border border-border bg-secondary text-secondary-foreground hover:border-[var(--border-hover)] hover:bg-accent",
        ghost: "bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
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
