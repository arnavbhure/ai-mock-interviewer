import { CircleDot } from "lucide-react";
import { Waveform } from "@/components/hero/InterviewHeroDemo/Waveform";

type RecordingPanelProps = {
  bars: number[];
  timer: string;
};

export function RecordingPanel({ bars, timer }: RecordingPanelProps) {
  return (
    <div className="grid gap-4 rounded-[26px] border border-border/70 bg-card p-5 shadow-card sm:grid-cols-[1fr_auto] sm:items-center">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-error/10 px-3 py-1 text-xs font-medium text-error">
          <CircleDot size={12} strokeWidth={2.25} className="animate-pulse" />
          Recording active
        </div>
        <p className="mt-3 text-sm text-muted-foreground">The interviewer is listening and adapting in real time.</p>
      </div>

      <div className="flex items-center gap-4 sm:justify-end">
        <Waveform bars={bars} />
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Timer</p>
          <p className="mt-1 font-mono text-lg font-medium text-foreground">{timer}</p>
        </div>
      </div>
    </div>
  );
}
