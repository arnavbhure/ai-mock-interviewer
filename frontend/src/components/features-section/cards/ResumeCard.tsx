import { motion } from "framer-motion";
import { BadgeCheck, Sparkles } from "lucide-react";
import { FeatureCard } from "@/components/features-section/FeatureCard";

const resumeLines = [
  "Senior Frontend Engineer",
  "React • TypeScript • Design Systems",
  "Built interview platform with adaptive AI",
  "Led migration to reusable component architecture",
];

const matchedSkills = ["React", "TypeScript", "Design Systems", "AI Product Thinking"];

export function ResumeCard() {
  return (
    <FeatureCard
      index={0}
      eyebrow="Resume-aware"
      title="Resume-aware interviews"
      description="We read the resume first, then shape the interview around the candidate's actual background and strengths."
      className="xl:col-span-7"
    >
      <div className="grid h-full gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-[22px] border border-border/70 bg-surface p-4 shadow-[0_10px_28px_rgba(15,23,42,0.05)]"
        >
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <span className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Resume preview</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-medium text-success">
              <Sparkles size={12} /> Parsed live
            </span>
          </div>

          <div className="mt-4 space-y-3">
            {resumeLines.map((line, index) => (
              <div
                key={line}
                className="h-3 rounded-full bg-muted/80"
                style={{ width: `${84 - index * 10}%` }}
              >
                {index === 1 ? (
                  <div className="flex h-full gap-2">
                    <motion.span
                      animate={{ opacity: [0.35, 1, 0.35] }}
                      transition={{ duration: 2.4, repeat: Infinity }}
                      className="w-24 rounded-full bg-primary/30"
                    />
                    <motion.span
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2.8, repeat: Infinity, delay: 0.2 }}
                      className="w-20 rounded-full bg-primary/20"
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="rounded-[22px] border border-border/70 bg-background p-4">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">Matched skills</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {matchedSkills.map((skill, index) => (
              <motion.span
                key={skill}
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, delay: index * 0.2 }}
                className="inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-medium text-primary"
              >
                <BadgeCheck size={12} />
                {skill}
              </motion.span>
            ))}
          </div>

          <div className="mt-5 rounded-[20px] border border-border/70 bg-surface p-4">
            <p className="text-sm font-medium text-foreground">Interview focus</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Prioritize systems thinking, design systems ownership, and the tradeoffs behind product decisions.
            </p>
          </div>
        </div>
      </div>
    </FeatureCard>
  );
}
