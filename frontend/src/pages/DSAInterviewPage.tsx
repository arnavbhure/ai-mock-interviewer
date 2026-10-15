import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BrainCircuit } from "lucide-react";
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
 * 1. Full problem statement with constraints & hints (spacious, high-readability column)
 * 2. Monaco Editor workspace and test execution suite (properly proportioned center column)
 * 3. AI Interviewer Orb with dynamic speech transcript & discussion dock (right companion panel)
 */
export function DSAInterviewPage() {
  const navigate = useNavigate();
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(true);

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
        isAiPanelOpen={isAiPanelOpen}
        onToggleAiPanel={() => setIsAiPanelOpen((prev) => !prev)}
      />

      {/* ── 2. Workspace Body (3-Panel Adaptive Grid) ── */}
      <main className="relative z-10 flex flex-1 overflow-hidden p-2.5 sm:p-3 gap-2.5 sm:gap-3 min-h-0">
        {/* Left Column: Problem Statement (Full Height, Generous Width) */}
        <section
          aria-label="Problem Statement"
          className="flex h-full flex-col overflow-hidden min-h-0 transition-all duration-300 w-[40%] lg:w-[42%] min-w-[340px] max-w-[620px] shrink-0"
        >
          <DSAProblemPanel problem={problem} />
        </section>

        {/* Center Column: Monaco Coding Editor + Test Result Panel */}
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
        </section>

        {/* Right Column: AI Interviewer Orb Panel & Discussion Dock */}
        {isAiPanelOpen ? (
          <aside
            aria-label="AI Interviewer"
            className="flex h-full w-[280px] lg:w-[320px] xl:w-[340px] flex-col overflow-hidden min-h-0 shrink-0 transition-all duration-300"
          >
            <DSAAIOrbPanel
              visualState={orbVisualState}
              dialogue={currentDialogue}
              isAiThinking={isAiThinking}
              candidateResponse={candidateResponse}
              onCandidateResponseChange={setCandidateResponse}
              onSubmitCandidateResponse={submitCandidateDiscussion}
              stage={stage}
              onToggleCollapse={() => setIsAiPanelOpen(false)}
            />
          </aside>
        ) : (
          /* Sleek Collapsed Bar on the Right */
          <div className="flex flex-col items-center justify-start shrink-0">
            <button
              type="button"
              onClick={() => setIsAiPanelOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/90 hover:bg-slate-800 p-2 text-xs font-medium text-slate-300 shadow-xl transition-all cursor-pointer [writing-mode:vertical-rl] rotate-180"
              title="Expand AI Interviewer Panel"
              aria-label="Expand AI Interviewer Panel"
            >
              <BrainCircuit className="h-4 w-4 text-indigo-400 rotate-90" />
              <span>AI Interviewer</span>
            </button>
          </div>
        )}
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
