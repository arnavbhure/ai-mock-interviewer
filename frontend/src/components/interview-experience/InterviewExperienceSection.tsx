import { InterviewExperienceIntro } from "@/components/interview-experience/InterviewExperienceIntro";
import { InterviewDemo } from "@/components/interview-experience/InterviewDemo";

/**
 * The first section immediately after the Hero.
 * Answers "What actually happens when I practice an interview with InterviewAI?"
 *
 * TODO: Connect to real interview session data once the API layer is ready.
 *       This is a static landing-page demonstration.
 */
export function InterviewExperienceSection() {
  return (
    <section
      id="interview-experience"
      className="relative overflow-hidden bg-background py-20 sm:py-24 lg:py-28"
    >
      {/* Hairline separator — consistent with the design system sections */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-border"
      />

      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <InterviewExperienceIntro />
          <InterviewDemo />
        </div>
      </div>
    </section>
  );
}