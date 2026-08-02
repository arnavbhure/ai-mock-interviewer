import { motion, useReducedMotion } from "framer-motion";
import { BrowserWindow } from "@/components/hero/InterviewHeroDemo/BrowserWindow";
import { QuestionCard } from "@/components/hero/InterviewHeroDemo/QuestionCard";
import { RecordingPanel } from "@/components/hero/InterviewHeroDemo/RecordingPanel";
import {
  LOGIN_FEATURE_CHIPS,
  LOGIN_PREVIEW_DESCRIPTION,
  LOGIN_PREVIEW_HEADLINE,
} from "@/constants/auth.constants";
import { PREMIUM_EASING } from "@/components/hero/animations/transitions";

const PREVIEW_QUESTION =
  "Walk me through how you would design a resume-driven interview flow that adapts to candidate answers.";

const PREVIEW_BARS = [32, 48, 36, 58, 44, 62, 40, 54, 46, 34];

function PreviewFloatingCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: PREMIUM_EASING, delay: 0.5 }}
      className="relative z-10 mx-auto -mt-10 hidden w-[calc(100%-3rem)] max-w-md sm:block"
    >
      <div className="rounded-[26px] border border-border/70 bg-card p-5 shadow-modal">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-success" />
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Analysis complete
          </p>
        </div>
        <p className="mt-3 text-sm leading-7 text-foreground">
          Strong technical depth and communication. Your report is ready.
        </p>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: "82%" }}
            transition={{ duration: 0.6, ease: PREMIUM_EASING, delay: 0.8 }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export function LoginPreview() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="relative flex min-h-full flex-col justify-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-16 -z-10 rounded-full bg-primary/8 blur-3xl"
      />

      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 18 }}
        animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: PREMIUM_EASING }}
      >
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-primary">
          InterviewAI Workspace
        </p>
        <h2 className="mt-4 text-balance text-2xl font-semibold tracking-[-0.03em] text-foreground sm:text-3xl">
          {LOGIN_PREVIEW_HEADLINE}
        </h2>
        <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
          {LOGIN_PREVIEW_DESCRIPTION}
        </p>
      </motion.div>

      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
        animate={reducedMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: PREMIUM_EASING, delay: 0.15 }}
        className="mt-10"
      >
        <div className="space-y-4">
          <BrowserWindow>
            <div className="space-y-4">
              <QuestionCard question={PREVIEW_QUESTION} />
              <RecordingPanel bars={PREVIEW_BARS} timer="12:34" />
            </div>
          </BrowserWindow>

          <PreviewFloatingCard />
        </div>
      </motion.div>

      <motion.div
        initial={reducedMotion ? false : { opacity: 0, y: 12 }}
        animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: PREMIUM_EASING, delay: 0.4 }}
        className="mt-8 flex flex-wrap gap-3"
      >
        {LOGIN_FEATURE_CHIPS.map((chip) => {
          const Icon = chip.icon;
          return (
            <span
              key={chip.label}
              className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-4 py-2 text-sm font-medium text-foreground shadow-card"
            >
              <Icon size={16} strokeWidth={1.75} className="text-primary" />
              {chip.label}
            </span>
          );
        })}
      </motion.div>
    </div>
  );
}

