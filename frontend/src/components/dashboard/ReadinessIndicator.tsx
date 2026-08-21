import { cn } from "@/lib/utils";

interface ReadinessIndicatorProps {
  completed: number;
  total: number;
}

export function ReadinessIndicator({ completed, total }: ReadinessIndicatorProps) {
  const isComplete = completed === total;

  return (
    <p
      className={cn(
        "text-body-sm transition-colors duration-base",
        isComplete ? "text-success" : "text-text-muted",
      )}
      role="status"
      aria-live="polite"
    >
      {isComplete
        ? "You're all set. Your personalized interview is ready."
        : "Complete all three steps to start your interview."}
      <span className="ml-2 text-caption text-text-muted">
        {completed} of {total} completed
      </span>
    </p>
  );
}
