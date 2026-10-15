import { useState } from "react";
import {
  ChevronDown,
  Lightbulb,
  Code2,
  ListFilter,
  AlertCircle,
  Copy,
  Check,
  FileText,
  Bookmark,
} from "lucide-react";
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
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [activeSection, setActiveSection] = useState<"description" | "examples" | "constraints" | "hints">("description");

  const toggleHint = (index: number) => {
    setOpenHints((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleCopyInput = (input: string, idx: number) => {
    navigator.clipboard.writeText(input);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1800);
  };

  const scrollToSection = (id: string, section: "description" | "examples" | "constraints" | "hints") => {
    setActiveSection(section);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const difficultyBadge = {
    Easy: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-emerald-500/10",
    Medium: "border-amber-500/30 bg-amber-500/10 text-amber-300 shadow-amber-500/10",
    Hard: "border-rose-500/30 bg-rose-500/10 text-rose-300 shadow-rose-500/10",
  }[problem.difficulty];

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-slate-950/90 shadow-2xl text-slate-200">
      {/* ── Top Header Bar with Navigation Tabs ── */}
      <div className="shrink-0 border-b border-white/[0.08] bg-slate-950/80 px-4 pt-3.5 pb-2.5 backdrop-blur-md">
        {/* Title, Difficulty & Question Number */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold border shadow-sm ${difficultyBadge}`}>
              {problem.difficulty}
            </span>
            <span className="text-xs font-mono font-medium text-slate-400">
              Problem {problem.questionNumber} of {problem.totalQuestions}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Bookmark className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Technical Problem</span>
          </div>
        </div>

        <h1 className="mt-2 text-base sm:text-lg lg:text-xl font-bold tracking-tight text-white">
          {problem.title}
        </h1>

        {/* Algorithm Tags */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {problem.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[11px] font-medium text-slate-400 hover:text-slate-300 transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Quick Anchor Navigation Tabs */}
        <div className="mt-3 flex items-center gap-1 border-t border-white/[0.06] pt-2 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => scrollToSection("section-description", "description")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
              activeSection === "description"
                ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
            }`}
          >
            <FileText className="h-3 w-3" />
            <span>Description</span>
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("section-examples", "examples")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
              activeSection === "examples"
                ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
            }`}
          >
            <Code2 className="h-3 w-3" />
            <span>Examples ({problem.examples.length})</span>
          </button>

          <button
            type="button"
            onClick={() => scrollToSection("section-constraints", "constraints")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
              activeSection === "constraints"
                ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/40"
                : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
            }`}
          >
            <ListFilter className="h-3 w-3" />
            <span>Constraints</span>
          </button>

          {problem.hints && problem.hints.length > 0 && (
            <button
              type="button"
              onClick={() => scrollToSection("section-hints", "hints")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                activeSection === "hints"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
              }`}
            >
              <Lightbulb className="h-3 w-3 text-amber-400" />
              <span>Hints ({problem.hints.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Problem Body (Smooth Scrollable Content) ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 text-sm leading-relaxed text-slate-300 select-text scroll-smooth scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {/* Description Section */}
        <div id="section-description" className="space-y-2">
          <p className="whitespace-pre-line text-slate-200 text-sm sm:text-[14.5px] leading-relaxed font-sans">
            {problem.description}
          </p>
        </div>

        {/* ── Examples Section ── */}
        <div id="section-examples" className="space-y-3 pt-2">
          <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Code2 className="h-4 w-4 text-indigo-400" />
            <span>Examples</span>
          </h2>

          <div className="space-y-3">
            {problem.examples.map((example, idx) => (
              <div
                key={idx}
                className="group relative rounded-xl border border-white/[0.08] bg-slate-900/70 p-3.5 transition-all hover:border-white/15"
              >
                {/* Header with Example # and Copy Input */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/[0.06]">
                  <span className="font-semibold text-xs text-slate-300">
                    Example {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyInput(example.input, idx)}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer px-1.5 py-0.5 rounded hover:bg-white/[0.06]"
                    title="Copy input string"
                  >
                    {copiedIdx === idx ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400 font-medium">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy Input</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-2 font-mono text-xs text-slate-300">
                  {/* Input row */}
                  <div className="flex items-baseline gap-2 bg-slate-950/60 rounded-lg px-2.5 py-1.5 border border-white/[0.04]">
                    <span className="text-slate-500 font-sans text-xs font-medium w-14 shrink-0">Input:</span>
                    <span className="text-indigo-300 font-medium break-all">{example.input}</span>
                  </div>

                  {/* Output row */}
                  <div className="flex items-baseline gap-2 bg-slate-950/60 rounded-lg px-2.5 py-1.5 border border-white/[0.04]">
                    <span className="text-slate-500 font-sans text-xs font-medium w-14 shrink-0">Output:</span>
                    <span className="text-emerald-300 font-semibold">{example.output}</span>
                  </div>

                  {/* Explanation row */}
                  {example.explanation && (
                    <div className="mt-2 pl-3 border-l-2 border-indigo-500/40 text-xs text-slate-400 font-sans leading-relaxed">
                      <span className="font-medium text-slate-300">Explanation: </span>
                      {example.explanation}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Constraints Section ── */}
        <div id="section-constraints" className="space-y-3 pt-2">
          <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <ListFilter className="h-4 w-4 text-indigo-400" />
            <span>Constraints</span>
          </h2>
          <div className="rounded-xl border border-white/[0.08] bg-slate-900/50 p-3">
            <ul className="space-y-1.5 font-mono text-xs text-slate-300">
              {problem.constraints.map((constraint, idx) => (
                <li key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-indigo-400 font-sans select-none">•</span>
                  <span className="bg-slate-950/70 border border-white/[0.04] px-1.5 py-0.5 rounded text-indigo-200">
                    {constraint}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Collapsible Hints Section ── */}
        {problem.hints && problem.hints.length > 0 && (
          <div id="section-hints" className="space-y-3 pt-2 pb-4">
            <h2 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Lightbulb className="h-4 w-4 text-amber-400" />
              <span>Hints ({problem.hints.length})</span>
            </h2>

            <div className="space-y-2">
              {problem.hints.map((hint, idx) => {
                const isOpen = openHints[idx];
                return (
                  <div
                    key={idx}
                    className="overflow-hidden rounded-xl border border-white/[0.08] bg-slate-900/60 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => toggleHint(idx)}
                      className="flex w-full items-center justify-between px-3.5 py-2.5 text-left text-xs font-medium text-slate-300 hover:bg-white/[0.03] transition-colors cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <span className="flex items-center gap-2">
                        <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
                        <span className="font-semibold text-slate-200">Hint {idx + 1}</span>
                      </span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-amber-400" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="border-t border-white/[0.06] px-3.5 py-2.5 text-xs leading-relaxed text-slate-300 bg-slate-950/40 font-sans">
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

