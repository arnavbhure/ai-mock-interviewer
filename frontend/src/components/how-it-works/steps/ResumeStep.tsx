import { Check, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { StepCard } from "@/components/how-it-works/StepCard";

const resumeSkills = ["React", "TypeScript", "Design Systems", "Product Thinking"];

export function ResumeStep() {
  const reduceMotion = useReducedMotion();

  return (
    <StepCard
      step="01"
      title="Upload Resume"
      description="InterviewAI reads the candidate's background first, then pulls the most relevant skills into the interview plan."
    >
      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          animate={reduceMotion ? undefined : { rotate: [-1.25, 0.75, -1.25], y: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-[24px] border border-border bg-surface p-4 shadow-card"
        >
          <div className="flex items-center justify-between border-b border-border pb-3">
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">Resume scan</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-medium text-success">
              <Sparkles size={12} /> Parsing
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {resumeSkills.map((skill, index) => (
              <motion.div
                key={skill}
                initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.25, delay: index * 0.1 }}
                className="flex items-center justify-between rounded-[18px] border border-border/70 bg-background px-4 py-3"
              >
                <span className="text-sm font-medium text-foreground">{skill}</span>
                <Check size={15} className="text-success" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="rounded-[24px] border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">AI highlights</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {resumeSkills.map((skill, index) => (
              <motion.span
                key={skill}
                animate={reduceMotion ? undefined : { y: [0, -2, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, delay: index * 0.15 }}
                className="rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-medium text-primary"
              >
                {skill}
              </motion.span>
            ))}
          </div>
          <div className="mt-5 rounded-[20px] border border-success/20 bg-success/8 p-4 text-sm leading-6 text-foreground">
            Green checks confirm the key skills are present and the interview can safely adapt to the candidate.
          </div>
        </div>
      </div>
    </StepCard>
  );
}
