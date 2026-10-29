import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDSAInterview } from "@/hooks/useDSAInterview";
import {
  DSAHeader,
  DSAProblemPanel,
  DSACodingWorkspace,
  DSATestResultPanel,
  DSAEndDialog,
  DSACompletionModal,
} from "@/components/dsa";

/**
 * Dedicated Real-Time DSA Coding Interview Experience.
 *
 * Immersive dark workspace combining:
 * 1. Full problem statement with constraints & hints (spacious, high-readability column)
 * 2. Monaco Editor workspace and test execution suite (properly proportioned code column)
 */
export function DSAInterviewPage() {
  const navigate = useNavigate();

  const {
    problem,
    language,
    setLanguage,
    activeCode,
    handleCodeChange,
    resetCode,
    stage,
    testResults,
    submissionSummary,
    selectedTestCaseId,
    setSelectedTestCaseId,
    activeTab,
    setActiveTab,
    runCode,
    submitSolution,
    skipProblem,
    nextQuestion,
    isSubmitted,
    formattedTime,
    isEndModalOpen,
    setIsEndModalOpen,
    isCompleteModalOpen,
    setIsCompleteModalOpen,
  } = useDSAInterview();

  // Listen to navigation events (e.g. when round changes or finishes)
  useEffect(() => {
    const handleNav = (e: Event) => {
      const custom = e as CustomEvent<{ path: string }>;
      if (custom?.detail?.path) {
        navigate(custom.detail.path);
      }
    };
    window.addEventListener("interview:navigate", handleNav);
    return () => window.removeEventListener("interview:navigate", handleNav);
  }, [navigate]);

  const handleEndConfirm = () => {
    setIsEndModalOpen(false);
    navigate("/dashboard");
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#060813] text-slate-100 antialiased select-none">
      {/* ── Background Ambient Lighting (Restrained) ── */}
      <div
        className="pointer-events-none absolute left-1/4 top-1/4 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/[0.07] blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-10 bottom-10 h-[350px] w-[350px] rounded-full bg-cyan-600/[0.04] blur-[120px]"
        aria-hidden="true"
      />

      {/* ── 1. Top Bar ── */}
      <DSAHeader
        roundTitle={problem.roundTitle}
        questionNumber={problem.questionNumber}
        totalQuestions={problem.totalQuestions}
        difficulty={problem.difficulty}
        formattedTime={formattedTime}
        onEndInterview={() => setIsEndModalOpen(true)}
      />

      {/* ── 2. Workspace Body (2-Panel Split: Problem on Left, Code & Tests on Right) ── */}
      <main className="relative z-10 flex flex-1 overflow-hidden p-2.5 sm:p-3 gap-2.5 sm:gap-3 min-h-0">
        {/* Left Column: Problem Statement (42% width, min 340px, max 620px) */}
        <section
          aria-label="Problem Statement"
          className="flex h-full flex-col overflow-hidden min-h-0 w-[42%] min-w-[340px] max-w-[620px] shrink-0"
        >
          <DSAProblemPanel problem={problem} />
        </section>

        {/* Right Column: Monaco Coding Editor + Test Result Panel */}
        <section
          aria-label="Coding Workspace and Tests"
          className="flex h-full flex-1 flex-col gap-2.5 sm:gap-3 overflow-hidden min-w-[380px] min-h-0"
        >
          {/* Top 62%: Code Editor */}
          <div className="flex-[3] min-h-0 overflow-hidden">
            <DSACodingWorkspace
              language={language}
              onLanguageChange={setLanguage}
              code={activeCode}
              onCodeChange={handleCodeChange}
              onResetCode={resetCode}
              onRunCode={runCode}
              onSubmitSolution={submitSolution}
              onSkipProblem={skipProblem}
              onNextQuestion={nextQuestion}
              isSubmitted={isSubmitted}
              stage={stage}
            />
          </div>

          {/* Bottom 38%: Test Results & Terminal */}
          <div className="flex-[2] min-h-0 overflow-hidden">
            <DSATestResultPanel
              stage={stage}
              testCases={problem.testCases}
              testResults={testResults}
              submissionSummary={submissionSummary}
              selectedTestCaseId={selectedTestCaseId}
              onSelectTestCase={setSelectedTestCaseId}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onRunCode={runCode}
            />
          </div>
        </section>
      </main>

      {/* ── Modals ── */}
      <DSAEndDialog
        isOpen={isEndModalOpen}
        onClose={() => setIsEndModalOpen(false)}
        onConfirm={handleEndConfirm}
      />

      <DSACompletionModal
        isOpen={isCompleteModalOpen}
        onClose={() => setIsCompleteModalOpen(false)}
        summary={submissionSummary}
        problemTitle={problem.title}
      />
    </div>
  );
}

export default DSAInterviewPage;
