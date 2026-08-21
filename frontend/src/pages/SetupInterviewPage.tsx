import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useDashboardForm } from "@/hooks/useDashboardForm";
import { RoleInput } from "@/components/dashboard/RoleInput";
import { ResumeUpload } from "@/components/dashboard/ResumeUpload";
import { DifficultySelector } from "@/components/dashboard/DifficultySelector";
import { ReadinessIndicator } from "@/components/dashboard/ReadinessIndicator";
import { StartInterviewCTA } from "@/components/dashboard/StartInterviewCTA";

function SetupStep({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-4">
      <p className="text-caption font-medium uppercase tracking-[0.16em] text-text-muted">
        {number} — {title}
      </p>
      {children}
    </section>
  );
}

export function SetupInterviewPage() {
  const reduced = useReducedMotion();
  const {
    form,
    isSubmitting,
    handleFileChange,
    removeFile,
    onSubmit,
    isFormValid,
    getCompletionCount,
    watchedRole,
    watchedDifficulty,
    watchedResume,
  } = useDashboardForm();

  return (
    <div className="mx-auto w-full max-w-[760px] px-4 py-10 sm:px-6 lg:px-8">
      <motion.header
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={reduced ? false : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10"
      >
        <h1 className="text-heading-2 text-text">Start a new interview</h1>
        <p className="mt-2 max-w-2xl text-body-sm text-text-muted">
          Configure a personalized mock interview around your target role, resume, and
          preferred difficulty — then start when you are ready.
        </p>
      </motion.header>

      <motion.form
        onSubmit={onSubmit}
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={reduced ? false : { opacity: 1, y: 0 }}
        transition={{
          duration: 0.45,
          delay: reduced ? 0 : 0.08,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="space-y-10 rounded-xl border border-border bg-surface p-5 shadow-card sm:space-y-12 sm:p-8"
      >
        <div>
          <h2 className="text-heading-3 text-text">Configure your interview</h2>
          <p className="mt-2 max-w-lg text-body-sm text-text-muted">
            Tell us what you're preparing for, upload your resume, and choose your
            difficulty.
          </p>
        </div>

        <SetupStep number="01" title="Role">
          <RoleInput
            value={watchedRole}
            onChange={(value) =>
              form.setValue("role", value, { shouldValidate: true, shouldDirty: true })
            }
            error={form.formState.errors.role?.message}
          />
        </SetupStep>

        <SetupStep number="02" title="Resume">
          <ResumeUpload
            file={watchedResume}
            onFileChange={handleFileChange}
            onRemove={removeFile}
          />
        </SetupStep>

        <SetupStep number="03" title="Difficulty">
          <DifficultySelector
            selected={watchedDifficulty}
            onChange={(difficulty) =>
              form.setValue("difficulty", difficulty, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
          />
        </SetupStep>

        <div className="space-y-5 border-t border-border pt-8">
          <ReadinessIndicator completed={getCompletionCount()} total={3} />
          <StartInterviewCTA isValid={isFormValid} isSubmitting={isSubmitting} />
        </div>
      </motion.form>
    </div>
  );
}