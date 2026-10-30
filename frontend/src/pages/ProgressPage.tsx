import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  TrendingUp,
  Award,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Target,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from "recharts";
import { useProgressStore } from "@/store/progress.store";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ value?: number | string }>;
  label?: string;
}) {
  if (!active || !payload?.length || typeof payload[0]?.value === "undefined") return null;

  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 shadow-card text-xs">
      <p className="font-semibold text-text">{label}</p>
      <p className="text-text-secondary mt-0.5">
        Score: <span className="font-semibold text-text">{payload[0].value}%</span>
      </p>
    </div>
  );
}

export function ProgressPage() {
  const reduced = useReducedMotion();

  const data = useProgressStore((s) => s.data);
  const isLoading = useProgressStore((s) => s.isLoading);
  const fetchProgress = useProgressStore((s) => s.fetchProgress);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const hasData = Boolean(data && data.totalSessions > 0);
  const skills = data?.skills ?? [];
  const progressionHistory = data?.progressionHistory ?? [];
  const topStrengths = data?.topStrengths ?? [];
  const focusAreas = data?.focusAreas ?? [];
  const recommendedPractice = data?.recommendedPractice ?? [];
  const avgScore = data?.averageScore ?? 0;
  const scoreChange = data?.scoreChange ?? 0;

  const enter = reduced ? false : { opacity: 0, y: 8 };
  const shown = reduced ? false : { opacity: 1, y: 0 };
  const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <div className="mx-auto w-full max-w-[1120px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12 text-text">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-0.5 text-[11px] font-semibold text-primary mb-2">
            <TrendingUp className="size-3" />
            <span>GROWTH & MASTERY</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text sm:text-[1.75rem]">
            Skill Progression
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Track competency mastery, improvement trends over time, and personalized focus areas.
          </p>
        </div>

        <Button asChild className="gap-2 shrink-0">
          <Link to="/dashboard/new">
            Practice Interview
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      {/* ── Loading Skeleton ── */}
      {isLoading ? (
        <div className="mt-8 space-y-8">
          <div className="grid gap-6 sm:grid-cols-3">
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </div>
          <Skeleton className="h-64 rounded-xl" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-56 rounded-xl" />
            <Skeleton className="h-56 rounded-xl" />
          </div>
        </div>
      ) : !hasData ? (
        /* ── Empty State ── */
        <div className="mt-12 rounded-2xl border border-dashed border-border bg-surface/50 p-12 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Target className="size-7" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-text">No skill profiles recorded yet</h2>
          <p className="mt-2 mx-auto max-w-md text-sm leading-relaxed text-text-secondary">
            Complete your first mock interview session to unlock your skill benchmarks, progress trajectory, and AI coaching recommendations.
          </p>
          <div className="mt-6 flex justify-center">
            <Button asChild className="gap-2 px-6">
              <Link to="/dashboard/new">
                Start your first interview
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        /* ── Main Analytics View ── */
        <motion.div
          initial={enter}
          animate={shown}
          transition={{ duration: 0.35, ease }}
          className="mt-8 space-y-8"
        >
          {/* 1. Metric Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Average Readiness */}
            <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
              <span className="text-xs font-medium text-text-muted">Readiness Score</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-text tabular-nums">{avgScore}%</span>
                {scoreChange !== 0 && (
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      scoreChange > 0 ? "text-emerald-500" : "text-rose-500",
                    )}
                  >
                    {scoreChange > 0 ? `+${scoreChange}%` : `${scoreChange}%`}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-text-secondary">
                {avgScore >= 80 ? "Exceeds standard hiring bar" : "Targeting competitive tier"}
              </p>
            </div>

            {/* Sessions Practiced */}
            <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
              <span className="text-xs font-medium text-text-muted">Total Evaluated Sessions</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-text tabular-nums">
                  {data?.totalSessions}
                </span>
                <span className="text-xs text-text-muted">interviews</span>
              </div>
              <p className="mt-1 text-xs text-text-secondary">Evaluated with adaptive rubrics</p>
            </div>

            {/* Top Strengths Identified */}
            <div className="rounded-xl border border-border bg-surface p-5 shadow-card">
              <span className="text-xs font-medium text-text-muted">Key Competencies</span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-text tabular-nums">
                  {topStrengths.length}
                </span>
                <span className="text-xs text-emerald-500 font-semibold">Verified</span>
              </div>
              <p className="mt-1 text-xs text-text-secondary">Strong technical patterns demonstrated</p>
            </div>
          </div>

          {/* 2. Core Skill Competency Breakdown */}
          <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <h2 className="text-base font-semibold text-text">Competency Breakdown</h2>
                <p className="text-xs text-text-secondary mt-0.5">
                  Proficiency scores calculated across algorithm tests, architecture, and live Q&A.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs text-text-muted">
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-primary" />
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-border" />
                  <span>Benchmark</span>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              {skills.map((skill) => {
                const isAboveBenchmark = skill.score >= skill.benchmark;

                return (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text">{skill.name}</span>
                        {skill.change > 0 && (
                          <span className="text-[11px] font-semibold text-emerald-500">
                            +{skill.change}%
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold tabular-nums text-text">{skill.score}%</span>
                        <span className="text-text-muted font-normal">
                          (Target {skill.benchmark}%)
                        </span>
                      </div>
                    </div>

                    <div className="relative mt-2 h-2.5 w-full overflow-hidden rounded-full bg-background-secondary">
                      {/* Benchmark marker line */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-text-muted/60 z-10"
                        style={{ left: `${skill.benchmark}%` }}
                        title={`Benchmark: ${skill.benchmark}%`}
                      />
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-700",
                          isAboveBenchmark ? "bg-primary" : "bg-indigo-400",
                        )}
                        style={{ width: `${skill.score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Progression Over Time Chart (if 2 or more sessions) */}
          {progressionHistory.length >= 2 && (
            <div className="rounded-xl border border-border bg-surface p-6 shadow-card">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-base font-semibold text-text">Performance Trajectory</h2>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Longitudinal growth curve across consecutive mock interviews.
                  </p>
                </div>
                <span className="text-xs font-semibold text-primary">
                  Average: {avgScore}%
                </span>
              </div>

              <div className="mt-5 h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={progressionHistory}
                    margin={{ top: 10, right: 10, bottom: 0, left: 0 }}
                  >
                    <CartesianGrid vertical={false} stroke="#E5E7EB" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="label"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "#98A2B3" }}
                      dy={8}
                    />
                    <YAxis
                      domain={[0, 100]}
                      ticks={[20, 40, 60, 80, 100]}
                      width={32}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "#98A2B3" }}
                    />
                    <ReferenceLine y={avgScore} stroke="#D1D5DB" strokeDasharray="4 4" />
                    <Tooltip content={<ChartTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="#4F46E5"
                      strokeWidth={2.5}
                      fill="#4F46E5"
                      fillOpacity={0.12}
                      activeDot={{ r: 4, strokeWidth: 2, stroke: "#FFFFFF", fill: "#4F46E5" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* 4. Dual Panels: Verified Strengths & Focus Areas */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Top Strengths */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] p-5 shadow-card">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm border-b border-emerald-500/15 pb-3">
                <CheckCircle2 className="size-4 shrink-0" />
                <h3>Consistent Strengths</h3>
              </div>
              <ul className="mt-3.5 space-y-2.5 text-xs leading-relaxed text-text">
                {topStrengths.length > 0 ? (
                  topStrengths.map((s, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="size-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-text-muted italic">
                    Consistent performance across technical areas.
                  </li>
                )}
              </ul>
            </div>

            {/* Priority Focus Areas */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.03] p-5 shadow-card">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-sm border-b border-amber-500/15 pb-3">
                <AlertTriangle className="size-4 shrink-0" />
                <h3>High-Impact Growth Areas</h3>
              </div>
              <ul className="mt-3.5 space-y-2.5 text-xs leading-relaxed text-text">
                {focusAreas.length > 0 ? (
                  focusAreas.map((w, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="size-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span>{w}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-text-muted italic">
                    No critical weaknesses detected in past sessions.
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* 5. Recommended Next Practice */}
          {recommendedPractice.length > 0 && (
            <div className="rounded-xl border border-primary/20 bg-primary/[0.03] p-5 shadow-card">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm border-b border-primary/15 pb-3">
                <Lightbulb className="size-4 shrink-0" />
                <h3>Personalized Action Plan</h3>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 text-xs leading-relaxed text-text">
                {recommendedPractice.map((rec, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 rounded-lg border border-primary/10 bg-surface p-3"
                  >
                    <Sparkles className="size-3.5 text-primary mt-0.5 shrink-0" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

