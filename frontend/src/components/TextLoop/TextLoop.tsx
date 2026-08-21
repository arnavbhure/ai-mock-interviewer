import { useMemo, type CSSProperties } from "react";
import "./TextLoop.css";
import { cn } from "@/lib/utils";

type TextLoopProps = {
  text: string;
  shape?: "wave" | "circle" | "linear";
  /** Seconds per full scroll loop. */
  speed?: number;
  fontSize?: number;
  fontWeight?: number;
  letterSpacing?: number;
  uppercase?: boolean;
  ribbon?: boolean;
  /** Muted brand color for the decorative text. */
  color?: string;
  pauseOnHover?: boolean;
  className?: string;
};

/**
 * A subtle animated typographic strip. Renders a phrase as a continuous
 * horizontal loop — each word gently bobbing in a wave. Decorative only,
 * so it stays muted and never sits behind important content.
 */
export function TextLoop({
  text,
  shape = "wave",
  speed = 32,
  fontSize = 14,
  fontWeight = 600,
  letterSpacing = 1,
  uppercase = true,
  ribbon = false,
  color,
  pauseOnHover = true,
  className,
}: TextLoopProps) {
  const tokens = useMemo(() => {
    const raw = uppercase ? text.toUpperCase() : text;
    return raw.split(/\s+/).filter(Boolean);
  }, [text, uppercase]);

  // Two identical copies make a seamless -50% scroll loop.
  const units = useMemo(() => {
    const copy = (offset: number) =>
      tokens.map((token, i) => {
        const phase = (i + offset) % Math.max(tokens.length, 1);
        const y = shape === "wave" ? Math.round(Math.sin(phase * 1.15) * 7) : 0;
        return { token, i: i + offset, y };
      });
    return [...copy(0), ...copy(tokens.length)];
  }, [tokens, shape]);

  return (
    <div
      className={cn(
        "text-loop",
        ribbon && "text-loop--ribbon",
        pauseOnHover && "text-loop--pause",
        className,
      )}
      aria-hidden="true"
    >
      <div
        className="text-loop__track"
        style={
          {
            "--loop-speed": `${speed}s`,
            "--loop-font-size": `${fontSize}px`,
            "--loop-weight": fontWeight,
            "--loop-tracking": `${letterSpacing}px`,
            "--loop-color": color ?? "var(--color-text-muted)",
          } as CSSProperties
        }
      >
        {units.map((unit, index) => (
          <span
            key={index}
            className="text-loop__unit"
            style={{ transform: `translateY(${unit.y}px)` }}
          >
            {unit.token}
          </span>
        ))}
      </div>
    </div>
  );
}