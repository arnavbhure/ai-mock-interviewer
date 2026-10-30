import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams, useParams, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  Award,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Code2,
  Calendar,
  Layers,
  Sparkles,
  HelpCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { getReportData } from "@/api/report/report.api";
import type { ReportData } from "@/types/report.types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function formatDate(isoStr?: string): string {
  if (!isoStr) return "Recently";
  try {
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return isoStr;
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(d);
  } catch {
    return isoStr;
  }
}

function HireChancePill({ chance }: { chance?: string | null }) {
  if (!chance) return null;
  const lower = chance.toLowerCase();

  let style = "bg-primary/10 text-primary border-primary/20";
  if (lower.includes("strong")) {
    style = "bg-emerald-500/10 text-emerald-500 border-emerald-500/25";
  } else if (lower.includes("no")) {
    style = "bg-rose-500/10 text-rose-500 border-rose-500/25";
  } else if (lower.includes("weak")) {
    style = "bg-amber-500/10 text-amber-500 border-amber-500/25";
  } else if (lower.includes("hire")) {
    style = "bg-green-500/10 text-green-500 border-green-500/25";
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase",
        style,
      )}
    >
      <Sparkles className="size-3.5" />
      {chance}
    </span>
  );
}

export function ReportsPage() {
  const reduced = useReducedMotion();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const params = useParams();

  const activeInterviewId = params.interviewId || searchParams.get("interviewId") || undefined;

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ReportData | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "questions" | "dsa">("overview");

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getReportData(activeInterviewId)
      .then((res) => {
        if (isMounted) {
          setData(res);
          // If the URL didn't have an ID and we received an interview, sync URL gently
          if (!activeInterviewId && res?.interview?.id) {
            setSearchParams({ interviewId: res.interview.id }, { replace: true });
          }
        }
      })
      .catch((err) => {
        console.error("Failed to load interview report:", err);
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeInterviewId, setSearchParams]);

  const interview = data?.interview;
  const finalEval = data?.finalEvaluation;
  const questionEvals = data?.questionEvaluations ?? [];
  const dsaEvals = data?.dsaEvaluations ?? [];
  const availableList = data?.availableInterviews ?? [];

  const overallScore = finalEval?.overallScore ?? 0;
  const scorePercent = Math.min(100, Math.max(0, Math.round(overallScore * 10)));

  const handleSelectInterview = (id: string) => {
    setSearchParams({ interviewId: id });
  };

  const enter = reduced ? false : { opacity: 0, y: 8 };
  const shown = reduced ? false : { opacity: 1, y: 0 };
  const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <div className="mx-auto w-full max-w-[1120px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12 text-text">
      {/* ── Top Bar / Navigation ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted transition-colors hover:text-text mb-2"
          >
            <ArrowLeft className="size-3.5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-text sm:text-[1.75rem]">
              Performance Report
            </h1>
            {finalEval && <HireChancePill chance={finalEval.hireChance} />}
          </div>
          <p className="mt-1 text-sm text-text-secondary">
            {interview
              ? `Evaluation debrief for ${interview.role} (${interview.difficulty} difficulty)`
              : "Review your detailed evaluation, rubric scoring, and interviewer feedback."}
          </p>
        </div>

        {/* Interview Switcher Dropdown */}
        {availableList.length > 1 && (
          <div className="flex items-center gap-2">
            <label htmlFor="interview-select" className="text-xs text-text-muted whitespace-nowrap">
              Session:
            </label>
            <select
              id="interview-select"
              value={interview?.id || ""}
              onChange={(e) => handleSelectInterview(e.target.value)}
              className="rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text shadow-sm focus:border-primary focus:outline-none"
            >
              {availableList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.role} • {item.score ? `${item.score}/10` : "No score"} ({formatDate(item.createdAt)})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ── Loading Skeleton State ── */}
      {isLoading ? (
        <div className="mt-8 space-y-8">
          <div className="grid gap-6 lg:grid-cols-12">
            <Skeleton className="h-44 rounded-xl lg:col-span-8" />
            <Skeleton className="h-44 rounded-xl lg:col-span-4" />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        </div>
      ) : !interview && !finalEval ? (
        /* ── Empty State ── */
        <div className="mt-12 rounded-2xl border border-dashed border-border bg-surface/50 p-12 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Award className="size-7" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-text">No completed evaluations found</h2>
          <p className="mt-2 mx-auto max-w-md text-sm leading-relaxed text-text-secondary">
            Complete a mock interview session to generate your comprehensive scorecard, rubric breakdown, and AI feedback.
          </p>
          <div className="mt-6 flex justify-center">
            <Button asChild className="gap-2 px-6">
              <Link to="/dashboard/new">
                Start an interview
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        /* ── Main Report Content ── */
        <motion.div
          initial={enter}
          animate={shown}
          transition={{ duration: 0.35, ease }}
          className="mt-8 space-y-8"
        >
          {/* 1. Score Overview Banner */}
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left 8 cols: Executive Summary */}
            <div className="rounded-xl border border-border bg-surface p-6 shadow-card lg:col-span-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span className="font-semibold uppercase tracking-wider text-primary">
                    Executive Summary
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    {formatDate(interview?.createdAt)}
                  </span>
                </div>
                <p className="mt-3 text-base leading-relaxed text-text font-medium">
                  {finalEval?.summary || "Interview session successfully completed and recorded."}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-text-muted">Target Position</span>
                  <p className="font-semibold text-text mt-0.5">{interview?.role}</p>
                </div>
                <div>
                  <span className="text-text-muted">Difficulty Level</span>
                  <p className="font-semibold capitalize text-text mt-0.5">{interview?.difficulty}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-text-muted">Evaluated Rounds</span>
                  <p className="font-semibold text-text mt-0.5">
                    {questionEvals.length} Questions {dsaEvals.length > 0 ? `+ ${dsaEvals.length} DSA` : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Right 4 cols: Final Score Dial */}
            <div className="rounded-xl border border-border bg-surface p-6 shadow-card lg:col-span-4 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                Overall Evaluation Score
              </span>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold tracking-tight text-text tabular-nums">
                  {overallScore > 0 ? overallScore.toFixed(1) : "--"}
                </span>
                <span className="text-sm font-semibold text-text-muted">/ 10</span>
              </div>

              {/* Progress bar */}
              <div className="mt-4 w-full h-2 rounded-full bg-background-secondary overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-700"
                  style={{ width: `${scorePercent}%` }}
                />
              </div>

              <p className="mt-3 text-xs text-text-secondary">
                {overallScore >= 8
                  ? "Exceeds standard hiring bar"
                  : overallScore >= 6.5
                    ? "Meets target competencies"
                    : "Room for structured improvement"}
              </p>
            </div>
          </div>

          {/* 2. Key Feedback Columns (Strengths, Weaknesses, Recommendations) */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Strengths */}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.03] p-5 shadow-card">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                <CheckCircle2 className="size-4 shrink-0" />
                <h3>Demonstrated Strengths</h3>
              </div>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-text">
                {(finalEval?.strengths && finalEval.strengths.length > 0) ? (
                  finalEval.strengths.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="size-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-text-muted italic">Clear approach and engaged responses.</li>
                )}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.03] p-5 shadow-card">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-sm">
                <AlertTriangle className="size-4 shrink-0" />
                <h3>Areas to Refine</h3>
              </div>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-text">
                {(finalEval?.weaknesses && finalEval.weaknesses.length > 0) ? (
                  finalEval.weaknesses.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="size-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-text-muted italic">No major red flags identified.</li>
                )}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="rounded-xl border border-primary/20 bg-primary/[0.03] p-5 shadow-card">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <Lightbulb className="size-4 shrink-0" />
                <h3>Actionable Next Steps</h3>
              </div>
              <ul className="mt-3 space-y-2 text-xs leading-relaxed text-text">
                {(finalEval?.recommendations && finalEval.recommendations.length > 0) ? (
                  finalEval.recommendations.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="size-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-text-muted italic">Practice structured technical storytelling.</li>
                )}
              </ul>
            </div>
          </div>

          {/* 3. Section Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-border pt-4">
            <button
              onClick={() => setActiveTab("overview")}
              className={cn(
                "pb-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === "overview"
                  ? "border-primary text-primary"
                  : "border-transparent text-text-muted hover:text-text",
              )}
            >
              Interview Questions ({questionEvals.length})
            </button>
            {dsaEvals.length > 0 && (
              <button
                onClick={() => setActiveTab("dsa")}
                className={cn(
                  "pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5",
                  activeTab === "dsa"
                    ? "border-primary text-primary"
                    : "border-transparent text-text-muted hover:text-text",
                )}
              >
                <Code2 className="size-4" />
                DSA Coding Performance ({dsaEvals.length})
              </button>
            )}
          </div>

          {/* 4. Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-4">
              {questionEvals.length > 0 ? (
                questionEvals.map((q, idx) => {
                  const qText =
                    typeof q.question === "string"
                      ? q.question
                      : q.question?.text || q.question?.question || `Question ${idx + 1}`;

                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-border bg-surface p-5 shadow-card transition-colors hover:border-border-hover"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3 text-xs">
                        <div className="flex items-center gap-2 font-medium text-text-secondary">
                          <span className="rounded bg-background-secondary px-2 py-0.5 font-mono text-[11px] text-text">
                            Q{q.questionNumber || idx + 1}
                          </span>
                          <span>Round {q.roundNumber || 1}</span>
                          {q.roundType && (
                            <>
                              <span>•</span>
                              <span className="capitalize">{q.roundType}</span>
                            </>
                          )}
                        </div>
                        {q.score !== undefined && (
                          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                            Score: {q.score} / 10
                          </span>
                        )}
                      </div>

                      {/* Question Text */}
                      <p className="mt-3 text-sm font-semibold text-text">{qText}</p>

                      {/* Candidate Answer */}
                      {q.answer && (
                        <div className="mt-3 rounded-lg bg-background-secondary/60 p-3 text-xs leading-relaxed text-text-secondary">
                          <span className="font-semibold text-text block mb-1">Your Response:</span>
                          <p className="italic">{q.answer}</p>
                        </div>
                      )}

                      {/* Evaluator Feedback */}
                      {q.feedback && (
                        <div className="mt-3 text-xs leading-relaxed text-text">
                          <span className="font-semibold text-primary block mb-0.5">Interviewer Feedback:</span>
                          <p>{q.feedback}</p>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="rounded-xl border border-border bg-surface p-6 text-center text-xs text-text-muted">
                  No individual question evaluations recorded for this session.
                </div>
              )}
            </div>
          )}

          {activeTab === "dsa" && (
            <div className="space-y-4">
              {dsaEvals.map((dsa, idx) => (
                <div
                  key={dsa.id || idx}
                  className="rounded-xl border border-border bg-surface p-5 shadow-card space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <Code2 className="size-4 text-primary" />
                      <h4 className="text-sm font-bold text-text">
                        {dsa.problemTitle || `Problem #${dsa.problemId}`}
                      </h4>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
                      Score: {dsa.score} / 10
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="rounded-lg border border-border bg-background-secondary/40 p-2.5">
                      <span className="text-text-muted block">Correctness</span>
                      <span className="font-semibold text-text mt-0.5 block">{dsa.correctness}</span>
                    </div>
                    <div className="rounded-lg border border-border bg-background-secondary/40 p-2.5">
                      <span className="text-text-muted block">Time Complexity</span>
                      <span className="font-mono font-semibold text-text mt-0.5 block">{dsa.timeComplexity}</span>
                    </div>
                    <div className="rounded-lg border border-border bg-background-secondary/40 p-2.5">
                      <span className="text-text-muted block">Space Complexity</span>
                      <span className="font-mono font-semibold text-text mt-0.5 block">{dsa.spaceComplexity}</span>
                    </div>
                  </div>

                  {/* Feedback */}
                  {dsa.feedback && (
                    <div className="text-xs leading-relaxed text-text">
                      <span className="font-semibold text-primary block mb-0.5">Code Evaluation Feedback:</span>
                      <p>{dsa.feedback}</p>
                    </div>
                  )}

                  {/* Strengths & Weaknesses */}
                  <div className="grid gap-3 sm:grid-cols-2 text-xs pt-2">
                    {dsa.strengths && dsa.strengths.length > 0 && (
                      <div className="rounded-lg bg-emerald-500/[0.04] p-3 border border-emerald-500/15">
                        <span className="font-semibold text-emerald-500 block mb-1">Strengths:</span>
                        <ul className="space-y-1">
                          {dsa.strengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-text">
                              <span className="text-emerald-500">•</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {dsa.weaknesses && dsa.weaknesses.length > 0 && (
                      <div className="rounded-lg bg-amber-500/[0.04] p-3 border border-amber-500/15">
                        <span className="font-semibold text-amber-500 block mb-1">Areas to Improve:</span>
                        <ul className="space-y-1">
                          {dsa.weaknesses.map((w, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-text">
                              <span className="text-amber-500">•</span>
                              <span>{w}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

