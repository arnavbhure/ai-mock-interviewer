import { DEMO_INTERVIEW } from "@/components/interview-experience/demo.data";

export function FollowUpQuestion() {
  return (
    <div className="px-4 py-4 sm:px-5 sm:py-5">
      <p className="text-[0.625rem] font-medium uppercase tracking-[0.22em] text-text-muted">
        Follow-up
      </p>
      <p className="mt-2 text-base leading-6 text-text sm:text-lg">
        “{DEMO_INTERVIEW.followUp}”
      </p>
    </div>
  );
}