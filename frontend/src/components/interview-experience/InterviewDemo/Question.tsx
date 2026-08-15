import { DEMO_INTERVIEW } from "@/components/interview-experience/demo.data";

export function Question() {
  return (
    <div className="px-4 py-4 sm:px-5 sm:py-5">
      <p className="text-[0.625rem] font-medium uppercase tracking-[0.22em] text-text-muted">
        Question
      </p>
      <p className="mt-2 text-base leading-6 text-text sm:text-lg">
        “{DEMO_INTERVIEW.question}”
      </p>
    </div>
  );
}