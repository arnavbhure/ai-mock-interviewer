import "./ShinyText.css";
import { cn } from "@/lib/utils";

type ShinyTextProps = {
  text: string;
  /** Disable the shine animation (respects reduced-motion callers). */
  disabled?: boolean;
  /** Animation duration in seconds. */
  speed?: number;
  className?: string;
};

/**
 * Subtle shine sweep across a small brand/product phrase.
 * Barely noticeable — enhances the premium feel without distracting.
 */
export function ShinyText({
  text,
  disabled = false,
  speed = 4,
  className,
}: ShinyTextProps) {
  return (
    <span
      className={cn("shiny-text", disabled && "shiny-text--disabled", className)}
      style={{ animationDuration: `${speed}s` }}
    >
      {text}
    </span>
  );
}