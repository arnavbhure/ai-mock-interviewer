import { useNavigate } from "react-router-dom";
import { useDSAInterview } from "@/hooks/useDSAInterview";
import {
  DSAHeader,
  DSAAIOrbPanel,
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
 * 1. AI Interviewer Orb with dynamic speech transcript & discussion dock
 * 2. Full problem statement with constraints & hints
 * 3. Monaco Editor workspace
 * 4. Multi-tab test execution and evaluation suite
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
    setStage,
    candidateResponse,
    setCandidateResponse,
    isAiThinking,
    submitCandidateDiscussion,
    orbVisualState,
    currentDialogue,
    testResults,
    submissionSummary,
    selectedTestCaseId,
    setSelectedTestCaseId,
    activeTab,
    setActiveTab,
    runCode,
    submitSolution,
    formattedTime,
    isEndModalOpen,
    setIsEndModalOpen,
    isCompleteModalOpen,
    setIsCompleteModalOpen,
  } = useDSAInterview();

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

      {/* ── 2. Workspace Body (2-Column Grid) ── */}
      <main className="relative z-10 flex flex-1 overflow-hidden p-3 gap-3">
        {/* Left Column: AI Orb Panel + Problem Description */}
        <div className="flex h-full w-full max-w-[360px] lg:max-w-[400px] flex-col gap-3 overflow-hidden shrink-0">
          {/* AI Interviewer Orb Card with Discussion Dock */}
          <div className="shrink-0">
            <DSAAIOrbPanel
              visualState={orbVisualState}
              dialogue={currentDialogue}
              isAiThinking={isAiThinking}
              candidateResponse={candidateResponse}
              onCandidateResponseChange={setCandidateResponse}
              onSubmitCandidateResponse={submitCandidateDiscussion}
            />
          </div>

          {/* Problem Statement Card (scrollable) */}
          <div className="flex-1 overflow-hidden min-h-0">
            <DSAProblemPanel problem={problem} />
          </div>
        </div>

        {/* Right Column: Monaco Coding Editor + Test Result Panel */}
        <div className="flex flex-1 flex-col gap-3 overflow-hidden min-w-0">
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
              onSkipToCoding={() => setStage("CODING")}
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
        </div>
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
