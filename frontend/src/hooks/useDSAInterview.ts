import { useState, useEffect, useCallback, useRef } from "react";
import type {
  DSALanguage,
  DSAInterviewStage,
  DSATestCase,
  DSASubmissionSummary,
  AIOrbVisualState,
  DSADialogueStep,
} from "@/types/dsaInterview.types";
import {
  MOCK_DSA_PROBLEMS,
  DSA_STAGE_DIALOGUES,
} from "@/data/dsaProblem.mock";

export function useDSAInterview() {
  const [problemIndex, setProblemIndex] = useState(0);
  const problem = MOCK_DSA_PROBLEMS[problemIndex] ?? MOCK_DSA_PROBLEMS[0];

  const [language, setLanguage] = useState<DSALanguage>("javascript");
  const [codeMap, setCodeMap] = useState<Record<DSALanguage, string>>(() => ({
    ...problem.starterCode,
  }));

  const [stage, setStage] = useState<DSAInterviewStage>("INTRO");
  const [candidateResponse, setCandidateResponse] = useState<string>("");
  const [isAiThinking, setIsAiThinking] = useState(false);

  const [testResults, setTestResults] = useState<DSATestCase[]>([]);
  const [submissionSummary, setSubmissionSummary] = useState<DSASubmissionSummary | null>(null);
  const [selectedTestCaseId, setSelectedTestCaseId] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"testcases" | "output" | "submission">("testcases");

  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  // ─── Elapsed Timer ──────────────────────────────────────────
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ─── Initial INTRO -> APPROACH_DISCUSSION Auto-Transition ───
  useEffect(() => {
    if (stage === "INTRO") {
      const timer = setTimeout(() => {
        setStage("APPROACH_DISCUSSION");
      }, 4200);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  // Current code for active language
  const activeCode = codeMap[language] ?? "";

  const handleCodeChange = useCallback(
    (newCode?: string) => {
      if (newCode === undefined) return;
      setCodeMap((prev) => ({
        ...prev,
        [language]: newCode,
      }));
    },
    [language],
  );

  const resetCode = useCallback(() => {
    setCodeMap((prev) => ({
      ...prev,
      [language]: problem.starterCode[language] ?? "",
    }));
  }, [language, problem]);

  // ─── Candidate Verbal / Text Discussion Response Handler ─────
  const submitCandidateDiscussion = useCallback(
    (textToSubmit?: string) => {
      const responseText = (textToSubmit ?? candidateResponse).trim();
      if (!responseText) return;

      setIsAiThinking(true);

      setTimeout(() => {
        setIsAiThinking(false);
        setCandidateResponse("");

        if (stage === "APPROACH_DISCUSSION") {
          setStage("APPROACH_EVALUATION");
        } else if (stage === "APPROACH_EVALUATION") {
          setStage("CODING");
        } else if (stage === "POST_SUBMISSION_DISCUSSION") {
          setStage("COMPLETED");
          setIsCompleteModalOpen(true);
        }
      }, 1000);
    },
    [candidateResponse, stage],
  );

  // ─── Run Code Simulation ────────────────────────────────────
  const runCode = useCallback(() => {
    if (stage === "RUNNING_CODE" || stage === "SUBMITTING") return;

    setStage("RUNNING_CODE");
    setActiveTab("testcases");

    setTimeout(() => {
      const results: DSATestCase[] = problem.testCases.map((tc, idx) => ({
        ...tc,
        actualOutput: tc.expectedOutput,
        passed: true,
        executionTime: `${28 + idx * 6} ms`,
        memory: `${41.4 + idx * 0.3} MB`,
        stdout: idx === 0 ? "Sliding window [0..2], maxLength = 3" : undefined,
      }));

      setTestResults(results);
      setStage("TEST_RESULTS");
    }, 850);
  }, [stage, problem]);

  // ─── Submit Solution Simulation ─────────────────────────────
  const submitSolution = useCallback(() => {
    if (stage === "SUBMITTING" || stage === "RUNNING_CODE") return;

    setStage("SUBMITTING");
    setActiveTab("submission");

    setTimeout(() => {
      const summary: DSASubmissionSummary = {
        status: "Accepted",
        totalTests: 25,
        passedTests: 25,
        runtime: "48 ms",
        memory: "42.3 MB",
        complexityTime: "O(n) Linear Time",
        complexitySpace: "O(min(m, n)) Hash Map",
        feedback:
          "Optimal sliding window implementation with two pointers. Effectively handles repeating characters with O(1) hash map lookups.",
      };

      setSubmissionSummary(summary);
      // Transition to post submission complexity discussion
      setStage("POST_SUBMISSION_DISCUSSION");
    }, 1200);
  }, [stage]);

  // ─── Active Dialogue Step & Orb State ───────────────────────
  const currentDialogue: DSADialogueStep = DSA_STAGE_DIALOGUES[stage] ?? DSA_STAGE_DIALOGUES.INTRO;

  const orbVisualState: AIOrbVisualState = (() => {
    if (isAiThinking) return "thinking";
    return currentDialogue.orbState;
  })();

  const formattedTime = `${String(Math.floor(elapsedSeconds / 60)).padStart(2, "0")}:${String(
    elapsedSeconds % 60,
  ).padStart(2, "0")}`;

  return {
    problem,
    problemIndex,
    setProblemIndex,
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
    elapsedSeconds,
    formattedTime,
    isEndModalOpen,
    setIsEndModalOpen,
    isCompleteModalOpen,
    setIsCompleteModalOpen,
  };
}
