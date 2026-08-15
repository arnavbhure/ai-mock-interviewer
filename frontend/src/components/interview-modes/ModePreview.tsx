import type { InterviewMode } from "@/components/interview-modes/modes.data";

type ModePreviewProps = {
  mode: InterviewMode;
  previewId: string;
};

export function ModePreview({ mode, previewId }: ModePreviewProps) {
  return (
    <div
      id={previewId}
      className="min-w-0 rounded-[28px] border border-border bg-surface p-5 shadow-[0_2px_10px_rgba(0,0,0,0.2)] sm:p-6 lg:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-5">
        <div className="min-w-0">
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.28em] text-text-muted">
            Interview Mode
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-text sm:text-[1.75rem]">
            {mode.preview.heading}
          </h3>
        </div>

        <span className="inline-flex items-center rounded-full border border-border bg-surface-elevated px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.24em] text-text-secondary">
          {mode.preview.difficulty}
        </span>
      </div>

      <div className="mt-6 grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0">
          <div>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.28em] text-text-muted">
              Focus
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              {mode.preview.focus.map((item) => (
                <div
                  key={item}
                  className="rounded-[16px] border border-border bg-surface-elevated px-4 py-3 text-sm font-medium text-text"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-[20px] border border-border bg-surface-elevated px-5 py-5">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.28em] text-text-muted">
              Example Question
            </p>
            <blockquote className="mt-4 text-pretty text-lg leading-8 tracking-[-0.02em] text-text sm:text-[1.375rem]">
              &ldquo;{mode.preview.example}&rdquo;
            </blockquote>
          </div>
        </div>

        <div className="rounded-[20px] border border-border bg-[#0D1219] p-5">
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.28em] text-text-muted">
            InterviewAI
          </p>
          <p className="mt-4 text-sm font-medium uppercase tracking-[0.24em] text-primary">
            {mode.preview.statusLabel}
          </p>
          <p className="mt-3 text-sm leading-7 text-text-secondary">
            {mode.preview.statusNote}
          </p>

          <div className="mt-6 flex h-16 items-end gap-1.5 rounded-[16px] border border-border bg-surface px-4 py-3">
            {mode.preview.waveform.map((height, index) => (
              <span
                key={`${mode.id}-${index}`}
                className="block w-2 rounded-full bg-primary/90"
                style={{ height }}
              />
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between rounded-[16px] border border-border bg-surface px-4 py-3 text-xs uppercase tracking-[0.22em] text-text-muted">
            <span>Voice Capture</span>
            <span className="text-text-secondary">Armed</span>
          </div>
        </div>
      </div>
    </div>
  );
}
