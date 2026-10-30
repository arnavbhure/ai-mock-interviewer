import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  Briefcase,
  Search,
  ArrowRight,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import { useInterviewHistoryStore } from "@/store/interviewHistory.store";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function formatDate(isoStr?: string): string {
  if (!isoStr) return "—";
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

function StatusBadge({ status }: { status: string }) {
  const isCompleted = status.toLowerCase() === "completed";
  const isActive = status.toLowerCase() === "active" || status.toLowerCase() === "planning";

  if (isCompleted) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-500">
        <CheckCircle2 className="size-3" />
        Completed
      </span>
    );
  }

  if (isActive) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-500">
        <Clock className="size-3" />
        In progress
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-background-secondary px-2.5 py-0.5 text-xs font-medium text-text-muted capitalize">
      {status}
    </span>
  );
}

function HireChanceBadge({ chance }: { chance: string | null }) {
  if (!chance) return <span className="text-text-muted">—</span>;

  const lower = chance.toLowerCase();
  let style = "text-text-secondary bg-background-secondary";
  if (lower.includes("strong")) {
    style = "text-emerald-500 bg-emerald-500/10 border border-emerald-500/20";
  } else if (lower.includes("no")) {
    style = "text-rose-500 bg-rose-500/10 border border-rose-500/20";
  } else if (lower.includes("weak")) {
    style = "text-amber-500 bg-amber-500/10 border border-amber-500/20";
  } else if (lower.includes("hire")) {
    style = "text-green-500 bg-green-500/10 border border-green-500/20";
  }

  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap", style)}>
      {chance}
    </span>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const lower = difficulty.toLowerCase();
  const color =
    lower === "hard"
      ? "text-rose-500"
      : lower === "medium"
        ? "text-amber-500"
        : "text-emerald-500";

  return <span className={cn("text-xs font-medium capitalize", color)}>{difficulty}</span>;
}

export function InterviewsPage() {
  const reduced = useReducedMotion();

  const interviews = useInterviewHistoryStore((s) => s.interviews);
  const isLoading = useInterviewHistoryStore((s) => s.isLoading);
  const fetchInterviews = useInterviewHistoryStore((s) => s.fetchInterviews);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const filteredInterviews = useMemo(() => {
    return interviews.filter((item) => {
      const matchesSearch =
        item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.summary && item.summary.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        statusFilter === "all" || item.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesDifficulty =
        difficultyFilter === "all" ||
        item.difficulty.toLowerCase() === difficultyFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesDifficulty;
    });
  }, [interviews, searchQuery, statusFilter, difficultyFilter]);

  const enter = reduced ? false : { opacity: 0, y: 8 };
  const shown = reduced ? false : { opacity: 1, y: 0 };
  const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

  return (
    <div className="mx-auto w-full max-w-[1120px] px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12 text-text">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-border pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-0.5 text-[11px] font-semibold text-primary mb-2">
            <Briefcase className="size-3" />
            <span>INTERVIEW ARCHIVE</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text sm:text-[1.75rem]">
            Interview History
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Browse all completed sessions, active attempts, evaluation scorecards, and AI feedback.
          </p>
        </div>

        <Button asChild className="gap-2 shrink-0">
          <Link to="/dashboard/new">
            Start New Interview
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by role or keyword..."
            className="w-full rounded-lg border border-border bg-surface pl-9 pr-4 py-2 text-xs font-medium text-text placeholder:text-text-muted shadow-sm focus:border-primary focus:outline-none"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-text shadow-sm focus:border-primary focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="active">In Progress</option>
          </select>

          {/* Difficulty filter */}
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className="rounded-lg border border-border bg-surface px-3 py-2 text-xs font-medium text-text shadow-sm focus:border-primary focus:outline-none"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      {/* ── Content Table / List ── */}
      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl" />
            ))}
          </div>
        ) : filteredInterviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface/50 p-12 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Briefcase className="size-6" />
            </div>
            <h2 className="mt-4 text-base font-semibold text-text">No interviews matched</h2>
            <p className="mt-1.5 mx-auto max-w-sm text-xs leading-relaxed text-text-secondary">
              {interviews.length === 0
                ? "You haven't completed any interviews yet. Complete your first practice session to generate reports."
                : "No interviews match your selected search criteria. Try resetting your filters."}
            </p>
            {interviews.length === 0 ? (
              <Button asChild size="sm" className="mt-5 gap-1.5">
                <Link to="/dashboard/new">
                  Start an interview
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setDifficultyFilter("all");
                }}
                className="mt-4 gap-1.5 text-xs"
              >
                <RotateCcw className="size-3.5" />
                Reset filters
              </Button>
            )}
          </div>
        ) : (
          <motion.div
            initial={enter}
            animate={shown}
            transition={{ duration: 0.35, ease }}
            className="overflow-hidden rounded-xl border border-border bg-surface shadow-card"
          >
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left" role="table">
                <thead>
                  <tr className="border-b border-border bg-background-secondary/30 text-xs font-semibold text-text-muted">
                    <th className="py-3 px-4">Role & Summary</th>
                    <th className="py-3 px-4">Difficulty</th>
                    <th className="py-3 px-4 text-right">Score</th>
                    <th className="py-3 px-4 text-center">Outcome</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-xs">
                  {filteredInterviews.map((item) => {
                    const isCompleted = item.status.toLowerCase() === "completed";

                    return (
                      <tr
                        key={item.id}
                        className="transition-colors hover:bg-background-secondary/40"
                      >
                        {/* Role & Summary */}
                        <td className="py-4 px-4 max-w-xs sm:max-w-md">
                          <p className="font-semibold text-sm text-text">{item.role}</p>
                          {item.summary ? (
                            <p className="mt-0.5 truncate text-xs text-text-secondary">
                              {item.summary}
                            </p>
                          ) : (
                            <p className="mt-0.5 text-xs text-text-muted">
                              Session ID: {item.id.slice(0, 8)}...
                            </p>
                          )}
                        </td>

                        {/* Difficulty */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <DifficultyBadge difficulty={item.difficulty} />
                        </td>

                        {/* Overall Score */}
                        <td className="py-4 px-4 text-right font-medium tabular-nums whitespace-nowrap text-text">
                          {item.overallScore !== null ? (
                            <span className="font-semibold">{item.overallScore.toFixed(1)} / 10</span>
                          ) : (
                            <span className="text-text-muted">—</span>
                          )}
                        </td>

                        {/* Outcome */}
                        <td className="py-4 px-4 text-center whitespace-nowrap">
                          <HireChanceBadge chance={item.hireChance} />
                        </td>

                        {/* Date */}
                        <td className="py-4 px-4 text-text-muted whitespace-nowrap">
                          {formatDate(item.createdAt)}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4 whitespace-nowrap">
                          <StatusBadge status={item.status} />
                        </td>

                        {/* Action Link */}
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          {isCompleted ? (
                            <Button asChild size="sm" variant="outline" className="h-8 gap-1 text-xs">
                              <Link to={`/reports?interviewId=${item.id}`}>
                                View Report
                                <ArrowRight className="size-3" />
                              </Link>
                            </Button>
                          ) : (
                            <Button asChild size="sm" className="h-8 gap-1 text-xs">
                              <Link to="/interview">
                                <Play className="size-3 fill-white" />
                                Resume
                              </Link>
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
