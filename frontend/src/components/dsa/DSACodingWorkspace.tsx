import { useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Play, Send, RotateCcw, Loader2, Code2, ArrowRight } from "lucide-react";
import type { DSALanguage, DSAInterviewStage } from "@/types/dsaInterview.types";
import { LANGUAGE_OPTIONS } from "@/data/dsaProblem.mock";
import { Button } from "@/components/ui/button";

type Props = {
  language: DSALanguage;
  onLanguageChange: (lang: DSALanguage) => void;
  code: string;
  onCodeChange: (value?: string) => void;
  onResetCode: () => void;
  onRunCode: () => void;
  onSubmitSolution: () => void;
  onSkipToCoding?: () => void;
  stage: DSAInterviewStage;
};

/**
 * Professional Monaco Editor Coding Workspace.
 */
export function DSACodingWorkspace({
  language,
  onLanguageChange,
  code,
  onCodeChange,
  onResetCode,
  onRunCode,
  onSubmitSolution,
  onSkipToCoding,
  stage,
}: Props) {
  const isRunning = stage === "RUNNING_CODE";
  const isSubmitting = stage === "SUBMITTING";
  const isDiscussion = stage === "INTRO" || stage === "APPROACH_DISCUSSION" || stage === "APPROACH_EVALUATION";
  const isBusy = isRunning || isSubmitting;

  const currentLangConfig = LANGUAGE_OPTIONS.find((l) => l.id === language) ?? LANGUAGE_OPTIONS[0];

  // ─── Keyboard Shortcut: Ctrl/Cmd + Enter to Run Code ─────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (!isBusy) {
          onRunCode();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isBusy, onRunCode]);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-slate-950/90 shadow-xl">
      {/* ── Editor Toolbar ── */}
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-white/[0.08] bg-slate-950 px-3.5 select-none">
        {/* Left: Language Selector */}
        <div className="flex items-center gap-2">
          <Code2 className="h-4 w-4 text-indigo-400" />
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as DSALanguage)}
            disabled={isBusy}
            aria-label="Programming Language"
            className="rounded-md border border-white/10 bg-slate-900 px-2.5 py-1 text-xs font-semibold text-slate-200 focus:border-indigo-500 focus:outline-none disabled:opacity-50"
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id} className="bg-slate-900 text-slate-200">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Reset, Run Code, Submit Solution */}
        <div className="flex items-center gap-2">
          {/* Reset Code */}
          <button
            type="button"
            onClick={onResetCode}
            disabled={isBusy}
            className="flex h-7.5 items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.02] px-2.5 text-xs font-medium text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-slate-200 disabled:opacity-40"
            title="Reset code template"
            aria-label="Reset code template"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden md:inline">Reset</span>
          </button>

          {/* Run Code */}
          <Button
            type="button"
            onClick={onRunCode}
            disabled={isBusy}
            size="sm"
            variant="outline"
            className="h-7.5 gap-1.5 border-white/10 bg-white/[0.03] text-xs font-medium text-slate-200 hover:bg-white/10 hover:text-white"
            title="Run sample tests (Ctrl + Enter)"
          >
            {isRunning ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin text-indigo-400" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="h-3 w-3 text-emerald-400 fill-emerald-400" />
                <span>Run Code</span>
              </>
            )}
          </Button>

          {/* Submit Solution */}
          <Button
            type="button"
            onClick={onSubmitSolution}
            disabled={isBusy}
            size="sm"
            className="h-7.5 gap-1.5 bg-indigo-600 px-3.5 text-xs font-semibold text-white shadow-md shadow-indigo-950 hover:bg-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                <Send className="h-3 w-3" />
                <span>Submit</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ── Discussion Phase Guidance Banner ── */}
      {isDiscussion && (
        <div className="flex items-center justify-between border-b border-indigo-500/20 bg-indigo-500/[0.07] px-3.5 py-1.5 text-xs text-indigo-300">
          <span>💡 Walk through your approach with the interviewer on the right first.</span>
          {onSkipToCoding && (
            <button
              type="button"
              onClick={onSkipToCoding}
              className="flex items-center gap-1 font-semibold text-indigo-200 hover:text-white underline underline-offset-2"
            >
              <span>Skip to Coding</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      )}

      {/* ── Monaco Editor Surface ── */}
      <div className="relative flex-1 w-full overflow-hidden bg-[#1e1e1e]">
        <Editor
          height="100%"
          language={currentLangConfig.monacoLang}
          value={code}
          theme="vs-dark"
          onChange={onCodeChange}
          options={{
            fontSize: 13,
            fontFamily: "JetBrains Mono, Menlo, Monaco, Consolas, monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            lineNumbers: "on",
            wordWrap: "on",
            formatOnPaste: true,
            formatOnType: true,
            padding: { top: 10, bottom: 10 },
          }}
          loading={
            <div className="flex h-full items-center justify-center text-xs text-slate-400 gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
              <span>Loading Monaco Workspace...</span>
            </div>
          }
        />
      </div>
    </div>
  );
}
