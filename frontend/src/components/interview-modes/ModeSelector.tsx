import type { InterviewMode } from "@/components/interview-modes/modes.data";
import { ModeItem } from "@/components/interview-modes/ModeItem";

type ModeSelectorProps = {
  modes: readonly InterviewMode[];
  activeIndex: number;
  onSelect: (index: number) => void;
  previewId: string;
};

export function ModeSelector({
  modes,
  activeIndex,
  onSelect,
  previewId,
}: ModeSelectorProps) {
  return (
    <nav aria-label="Interview mode selector" className="w-full lg:max-w-[260px]">
      <div className="rounded-[22px] border border-border bg-surface p-2 shadow-[0_1px_2px_rgba(0,0,0,0.14)]">
        <div className="grid gap-2">
          {modes.map((mode, index) => (
            <ModeItem
              key={mode.id}
              mode={mode}
              isActive={index === activeIndex}
              onSelect={() => onSelect(index)}
              previewId={previewId}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
