import { useState } from "react";
import { ChevronDown, Lightbulb, Code2, ListFilter, AlertCircle } from "lucide-react";
import type { DSAProblem } from "@/types/dsaInterview.types";

type Props = {
  problem: DSAProblem;
};

/**
 * Left/Center Problem Description Panel.
 * High-readability technical problem statement with examples, constraints, and hints.
 */
export function DSAProblemPanel({ problem }: Props) {
  const [openHints, setOpenHints] = useState<Record<number, boolean>>({});

  const toggleHint = (index: number) => {
    setOpenHints((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const difficultyBadge = {
    Easy: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    Medium: "border-amber-500/30 bg-amber-500/10 text-amber-300",
    Hard: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  }[problem.difficulty];

  return (
    <div className="flex h-full flex-col overflow-y-auto rounded-xl border border-white/[0.08] bg-slate-950/80 p-4 shadow-xl text-slate-200">
      {/* ── Title & Tags Header ── */}
      <div className="border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold border ${difficultyBadge}`}>
            {problem.difficulty}
          </span>
          <span className="text-xs text-slate-400">Problem {problem.questionNumber}</span>
        </div>

        <h1 className="mt-1.5 text-base sm:text-lg font-bold tracking-tight text-white">
          {problem.title}
        </h1>

        {/* Algorithm Tags */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1">
          {problem.tags.map((tag) => (
            <span
              key={tag}
              className="rounded border border-white/[0.08] bg-white/[0.02] px-2 py-0.5 text-[10px] font-medium text-slate-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── Problem Body ── */}
      <div className="space-y-5 pt-3.5 text-xs sm:text-[13px] leading-relaxed text-slate-300">
        {/* Description */}
        <div>
          <p className="whitespace-pre-line text-slate-200 leading-relaxed font-sans">
            {problem.description}
          </p>
        </div>

        {/* ── Examples ── */}
        <div className="space-y-2.5">
          <h2 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <Code2 className="h-3.5 w-3.5 text-indigo-400" />
            <span>Examples</span>
          </h2>

          <div className="space-y-2">
            {problem.examples.map((example, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-white/[0.06] bg-slate-900/80 p-3 text-xs"
              >
                <p className="font-semibold text-slate-200">Example {idx + 1}:</p>
                <div className="mt-1.5 space-y-1 font-mono text-[11px] text-slate-300">
                  <p>
                    <span className="text-slate-500 font-sans">Input: </span>
                    <span className="text-indigo-300 font-medium">{example.input}</span>
                  </p>
                  <p>
                    <span className="text-slate-500 font-sans">Output: </span>
                    <span className="text-emerald-300 font-semibold">{example.output}</span>
                  </p>
                  {example.explanation && (
                    <p className="mt-1 font-sans text-xs text-slate-400">
                      <span className="font-medium text-slate-500">Explanation: </span>
                      {example.explanation}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Constraints ── */}
        <div className="space-y-2">
          <h2 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            <ListFilter className="h-3.5 w-3.5 text-indigo-400" />
            <span>Constraints</span>
          </h2>
          <ul className="list-inside list-disc space-y-1 rounded-lg border border-white/[0.06] bg-slate-900/40 p-2.5 text-xs text-slate-300 font-mono">
            {problem.constraints.map((constraint, idx) => (
              <li key={idx} className="leading-normal">
                {constraint}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Collapsible Hints ── */}
        {problem.hints && problem.hints.length > 0 && (
          <div className="space-y-1.5 pt-0.5">
            <h2 className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
              <span>Hints ({problem.hints.length})</span>
            </h2>

            <div className="space-y-1.5">
              {problem.hints.map((hint, idx) => {
                const isOpen = openHints[idx];
                return (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-lg border border-white/[0.06] bg-slate-900/60"
                  >
                    <button
                      type="button"
                      onClick={() => toggleHint(idx)}
                      className="flex w-full items-center justify-between px-3 py-2 text-left text-xs font-medium text-slate-300 hover:bg-white/[0.02]"
                      aria-expanded={isOpen}
                    >
                      <span className="flex items-center gap-1.5">
                        <AlertCircle className="h-3 w-3 text-amber-400" />
                        <span>Hint {idx + 1}</span>
                      </span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="border-t border-white/[0.06] px-3 py-2 text-xs leading-relaxed text-slate-300 bg-black/20 font-sans">
                        {hint}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
