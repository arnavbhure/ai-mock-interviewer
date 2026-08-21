import { cn } from "@/lib/utils";
import { DIFFICULTY_OPTIONS, type Difficulty } from "@/types/dashboard.types";

interface DifficultySelectorProps {
  selected: Difficulty | null;
  onChange: (difficulty: Difficulty) => void;
}

export function DifficultySelector({ selected, onChange }: DifficultySelectorProps) {
  return (
    <fieldset>
      <legend className="text-label text-text">Difficulty</legend>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {DIFFICULTY_OPTIONS.map((option) => {
          const isSelected = selected === option.value;

          return (
            <label
              key={option.value}
              className={cn(
                "cursor-pointer rounded-card border bg-surface p-4 transition-colors duration-base ease-premium",
                "hover:border-primary/40 hover:bg-primary/4",
                isSelected
                  ? "border-primary bg-primary/10"
                  : "border-border",
              )}
            >
              <input
                type="radio"
                name="difficulty"
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              <span className="flex items-start gap-3">
                <span
                  className={cn(
                    "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-base",
                    isSelected ? "border-primary bg-primary" : "border-border bg-surface",
                  )}
                  aria-hidden="true"
                >
                  {isSelected ? (
                    <span className="size-1.5 rounded-full bg-primary-foreground" />
                  ) : null}
                </span>
                <span>
                  <span className="block text-sm font-medium text-text">{option.label}</span>
                  <span className="mt-1 block text-caption text-text-muted">
                    {option.description}
                  </span>
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
