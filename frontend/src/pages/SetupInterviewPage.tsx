import { useEffect, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useDashboardForm } from "@/hooks/useDashboardForm";
import { RoleInput } from "@/components/dashboard/RoleInput";
import { ResumeUpload } from "@/components/dashboard/ResumeUpload";
import { DifficultySelector } from "@/components/dashboard/DifficultySelector";
import { ReadinessIndicator } from "@/components/dashboard/ReadinessIndicator";
import { StartInterviewCTA } from "@/components/dashboard/StartInterviewCTA";
import socket from "@/socket/socket";

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
      <p className="text-xs font-medium text-text-muted">
        {number} — {title}
      </p>
      {children}
    </section>
  );
}

export function SetupInterviewPage() {
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

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
    <div className="mx-auto w-full max-w-[760px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
      <motion.header
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={reduced ? false : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10"
      >
        <h1 className="text-[1.75rem] font-bold leading-tight tracking-tight text-text">
          Start a new interview
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-text-secondary">
          Set the role, resume, and difficulty, then begin when you are ready.
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
        className="space-y-10 sm:space-y-12"
      >
        <div>
          <h2 className="text-sm font-medium text-text">Configuration</h2>
          <p className="mt-1 max-w-lg text-sm text-text-secondary">
            These details personalize the questions you will get.
          </p>
        </div>

        <SetupStep number="01" title="Role">
          <RoleInput
            value={watchedRole}
            onChange={(value) =>
              form.setValue("role", value, {
                shouldValidate: true,
                shouldDirty: true,
              })
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
          <StartInterviewCTA
            isValid={isFormValid}
            isSubmitting={isSubmitting}
          />
        </div>
      </motion.form>
    </div>
  );
}
