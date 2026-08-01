import { Circle, Minus, Square } from "lucide-react";

export function BrowserToolbar() {
  return (
    <div className="flex items-center justify-between border-b border-border/70 bg-background/90 px-5 py-3">
      <div className="flex items-center gap-2">
        <span className="size-3 rounded-full bg-destructive/80" />
        <span className="size-3 rounded-full bg-warning/80" />
        <span className="size-3 rounded-full bg-success/80" />
      </div>

      <div className="flex items-center gap-2 rounded-full border border-border/70 bg-secondary px-3 py-1.5 text-xs text-muted-foreground">
        <Circle size={12} strokeWidth={1.75} className="text-primary" />
        InterviewAI / Session
      </div>

      <div className="flex items-center gap-2 text-muted-foreground">
        <Minus size={14} strokeWidth={1.75} />
        <Square size={12} strokeWidth={1.75} />
      </div>
    </div>
  );
}
