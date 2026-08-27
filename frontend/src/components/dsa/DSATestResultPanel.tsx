import { CheckCircle2, XCircle, Terminal, Play, Loader2, Sparkles, Cpu, Clock } from "lucide-react";
import type { DSATestCase, DSASubmissionSummary, DSAInterviewStage } from "@/types/dsaInterview.types";

type Props = {
  stage: DSAInterviewStage;
  testCases: DSATestCase[];
  testResults: DSATestCase[];
  submissionSummary: DSASubmissionSummary | null;
  selectedTestCaseId: number;
  onSelectTestCase: (id: number) => void;
  activeTab: "testcases" | "output" | "submission";
  onTabChange: (tab: "testcases" | "output" | "submission") => void;
  onRunCode: () => void;
};

/**
 * Bottom Test Results & Terminal Panel.
 */
export function DSATestResultPanel({
  stage,
  testCases,
  testResults,
  submissionSummary,
  selectedTestCaseId,
  onSelectTestCase,
  activeTab,
  onTabChange,
  onRunCode,
}: Props) {
  const isRunning = stage === "RUNNING_CODE";
  const isSubmitting = stage === "SUBMITTING";
  const hasRun = testResults.length > 0;

  const displayedCases = hasRun ? testResults : testCases;
  const currentCase = displayedCases.find((tc) => tc.id === selectedTestCaseId) ?? displayedCases[0];

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-slate-950/90 shadow-xl">
      {/* ── Tabs Bar ── */}
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-white/[0.08] bg-slate-950 px-3 select-none">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onTabChange("testcases")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              activeTab === "testcases"
                ? "bg-white/[0.08] text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Test Cases</span>
            {hasRun && (
              <span className="ml-1 rounded bg-emerald-500/20 px-1 py-0.2 text-[10px] font-semibold text-emerald-300">
                {testResults.filter((r) => r.passed).length}/{testResults.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => onTabChange("output")}
            className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
              activeTab === "output"
                ? "bg-white/[0.08] text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Terminal className="h-3.5 w-3.5 text-indigo-400" />
            <span>Console Output</span>
          </button>

          {submissionSummary && (
            <button
              type="button"
              onClick={() => onTabChange("submission")}
              className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                activeTab === "submission"
                  ? "bg-white/[0.08] text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-purple-400" />
              <span>Submission Report</span>
            </button>
          )}
        </div>

        {/* Runtime info badges */}
        {hasRun && !isRunning && currentCase?.executionTime && (
          <div className="hidden sm:flex items-center gap-2.5 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-slate-500" />
              {currentCase.executionTime}
            </span>
            <span className="flex items-center gap-1">
              <Cpu className="h-3 w-3 text-slate-500" />
              {currentCase.memory}
            </span>
          </div>
        )}
      </div>

      {/* ── Tab Body ── */}
      <div className="flex-1 overflow-y-auto p-3.5 text-xs">
        {/* Loading: Running */}
        {isRunning && (
          <div className="flex h-full flex-col items-center justify-center gap-1.5 py-6 text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin text-indigo-400" />
            <p className="font-medium text-slate-300 text-xs">Running test suite...</p>
            <p className="text-[11px] text-slate-500">Compiling against sample test cases</p>
          </div>
        )}

        {/* Loading: Submitting */}
        {isSubmitting && (
          <div className="flex h-full flex-col items-center justify-center gap-1.5 py-6 text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
            <p className="font-medium text-slate-300 text-xs">Evaluating full submission...</p>
            <p className="text-[11px] text-slate-500">Running 25 benchmark and edge cases</p>
          </div>
        )}

        {/* Tab 1: Test Cases */}
        {!isRunning && !isSubmitting && activeTab === "testcases" && (
          <div className="space-y-3">
            {/* Case selector pills */}
            <div className="flex items-center gap-1.5">
              {displayedCases.map((tc, idx) => (
                <button
                  key={tc.id}
                  type="button"
                  onClick={() => onSelectTestCase(tc.id)}
                  className={`flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                    selectedTestCaseId === tc.id
                      ? "border-indigo-500/40 bg-indigo-500/15 text-white"
                      : "border-white/[0.08] bg-white/[0.02] text-slate-400 hover:bg-white/[0.04]"
                  }`}
                >
                  {hasRun ? (
                    tc.passed ? (
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-400" />
                    )
                  ) : null}
                  <span>Case {idx + 1}</span>
                </button>
              ))}
            </div>

            {/* Selected case details */}
            {currentCase ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 font-mono text-[11px]">
                {/* Input */}
                <div className="rounded-lg border border-white/[0.06] bg-slate-900/80 p-2.5">
                  <span className="font-sans text-[10px] font-medium uppercase tracking-wider text-slate-500">
                    Input
                  </span>
                  <p className="mt-1 text-indigo-300 font-medium">{currentCase.input}</p>
                </div>

                {/* Expected Output */}
                <div className="rounded-lg border border-white/[0.06] bg-slate-900/80 p-2.5">
                  <span className="font-sans text-[10px] font-medium uppercase tracking-wider text-slate-500">
                    Expected Output
                  </span>
                  <p className="mt-1 text-emerald-300 font-semibold">{currentCase.expectedOutput}</p>
                </div>

                {/* Actual Output */}
                {hasRun && (
                  <div className="rounded-lg border border-white/[0.06] bg-slate-900/80 p-2.5 md:col-span-2">
                    <span className="font-sans text-[10px] font-medium uppercase tracking-wider text-slate-500">
                      Actual Output
                    </span>
                    <p
                      className={`mt-1 font-semibold ${
                        currentCase.passed ? "text-emerald-300" : "text-red-400"
                      }`}
                    >
                      {currentCase.actualOutput ?? "—"}
                    </p>
                  </div>
                )}
              </div>
            ) : null}

            {!hasRun && (
              <div className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-slate-900/40 p-2.5 text-slate-400">
                <span>Click "Run Code" or press Ctrl+Enter to execute test cases.</span>
                <button
                  type="button"
                  onClick={onRunCode}
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  <Play className="h-3 w-3 fill-indigo-400" />
                  <span>Run</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Console Output */}
        {!isRunning && !isSubmitting && activeTab === "output" && (
          <div className="rounded-lg border border-white/[0.06] bg-black/40 p-3 font-mono text-xs text-slate-300">
            {hasRun ? (
              <div className="space-y-1">
                <p className="text-slate-500">=== Standard Output Stream ===</p>
                <p className="text-emerald-400">✓ Test execution completed successfully in 48ms</p>
                <p className="text-slate-300">{currentCase?.stdout ?? "No explicit print statements captured."}</p>
              </div>
            ) : (
              <p className="text-slate-500">No output yet. Click "Run Code" to view stdout logs.</p>
            )}
          </div>
        )}

        {/* Tab 3: Submission Summary */}
        {!isRunning && !isSubmitting && activeTab === "submission" && submissionSummary && (
          <div className="space-y-2.5">
            <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-emerald-300 text-xs">{submissionSummary.status}</h3>
                  <p className="text-[10px] text-emerald-400/90">
                    Passed {submissionSummary.passedTests} of {submissionSummary.totalTests} benchmark tests
                  </p>
                </div>
              </div>
              <div className="text-right font-mono text-[11px]">
                <p className="text-slate-300">Runtime: <span className="text-emerald-300">{submissionSummary.runtime}</span></p>
                <p className="text-slate-400">Memory: <span>{submissionSummary.memory}</span></p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg border border-white/[0.06] bg-slate-900/60 p-2">
                <span className="text-slate-500 text-[10px]">Time Complexity</span>
                <p className="font-semibold text-slate-200 text-xs">{submissionSummary.complexityTime}</p>
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-slate-900/60 p-2">
                <span className="text-slate-500 text-[10px]">Space Complexity</span>
                <p className="font-semibold text-slate-200 text-xs">{submissionSummary.complexitySpace}</p>
              </div>
            </div>

            <p className="text-xs italic text-slate-400 leading-relaxed pt-0.5">
              &ldquo;{submissionSummary.feedback}&rdquo;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
