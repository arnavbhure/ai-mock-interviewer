export function InterviewHeader() {
  return (
    <div className="flex items-center justify-between border-b border-border bg-surface-elevated px-4 py-2.5 sm:px-5">
      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-text">
        InterviewAI
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-button border border-border px-2 py-1 text-[0.625rem] font-medium uppercase tracking-[0.18em] text-success">
        <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
        Live
      </span>
    </div>
  );
}