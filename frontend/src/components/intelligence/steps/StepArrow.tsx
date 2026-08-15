/** Subtle vertical connector shown between steps in the stacked layout. */
export function StepArrow() {
  return (
    <div className="flex justify-center py-2" aria-hidden="true">
      <span className="h-8 w-px bg-border" />
    </div>
  );
}