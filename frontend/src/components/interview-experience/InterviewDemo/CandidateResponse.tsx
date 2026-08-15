import { DEMO_INTERVIEW } from "@/components/interview-experience/demo.data";

export function CandidateResponse() {
  return (
    <div className="px-4 py-4 sm:px-5 sm:py-5">
      <p className="text-[0.625rem] font-medium uppercase tracking-[0.22em] text-text-muted">
        Candidate response
      </p>
      <p className="mt-2 text-sm leading-6 text-text-secondary">
        “{DEMO_INTERVIEW.candidateResponse}…”
      </p>
    </div>
  );
}