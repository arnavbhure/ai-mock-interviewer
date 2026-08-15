import type { InterviewMode } from "@/components/interview-modes/modes.data";
import { cn } from "@/lib/utils";

type ModeItemProps = {
  mode: InterviewMode;
  isActive: boolean;
  onSelect: () => void;
  previewId: string;
};

export function ModeItem({ mode, isActive, onSelect, previewId }: ModeItemProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isActive}
      aria-controls={previewId}
      className={cn(
        "w-full rounded-[18px] border px-4 py-4 text-left transition-[background-color,border-color,color,box-shadow] duration-200 ease-premium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive
          ? "border-primary/60 bg-primary/8 text-text shadow-[0_1px_2px_rgba(0,0,0,0.18)]"
          : "border-transparent bg-transparent text-text-secondary hover:border-border hover:bg-surface-elevated/70 hover:text-text",
      )}
    >
      <span className="block text-[0.7rem] font-medium uppercase tracking-[0.28em] text-text-muted">
        {mode.index}
      </span>
      <span className="mt-2 block text-base font-medium tracking-[-0.02em]">
        {mode.title}
      </span>
    </button>
  );
}
