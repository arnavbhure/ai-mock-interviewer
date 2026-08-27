import { useCallback, useEffect, useRef, useState } from "react";
import { useInterviewStore } from "@/store/interview.store";
import type { OrbState } from "@/types/interview.types";
import {
  getInterviewState,
  submitResponse,
  endInterview as endInterviewService,
} from "@/services/interviewService";
import { MOCK_QUESTIONS, MOCK_INTERVIEW_CONFIG, buildMockQuestion } from "@/data/interview.mock";

export function useInterviewSession() {
  const status = useInterviewStore((s) => s.status);
  const interviewId = useInterviewStore((s) => s.interviewId);
  const currentQuestion = useInterviewStore((s) => s.currentQuestion);
  const setQuestion = useInterviewStore((s) => s.setQuestion);
  const submitAnswer = useInterviewStore((s) => s.submitAnswer);
  const setCompleted = useInterviewStore((s) => s.setCompleted);

  const [orbState, setOrbState] = useState<OrbState>("AI_SPEAKING");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [answerSeconds, setAnswerSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isEndDialogOpen, setIsEndDialogOpen] = useState(false);
  const [candidateTranscript, setCandidateTranscript] = useState("");

  const stateTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const typingTimerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const clearTimers = useCallback(() => {
    if (stateTimerRef.current !== undefined) {
      clearTimeout(stateTimerRef.current);
      stateTimerRef.current = undefined;
    }
    if (typingTimerRef.current !== undefined) {
      clearInterval(typingTimerRef.current);
      typingTimerRef.current = undefined;
    }
  }, []);

  // ─── Elapsed interview timer ─────────────────────────────────
  useEffect(() => {
    if (status !== "active" && status !== "starting") return;

    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  // ─── Answer duration timer (active during LISTENING) ────────
  useEffect(() => {
    if (orbState !== "LISTENING") return;

    const timer = setInterval(() => {
      setAnswerSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [orbState]);

  // ─── Simulated live candidate speech typing in LISTENING ─────
  useEffect(() => {
    if (orbState !== "LISTENING") return;

    const currentMock = buildMockQuestion(questionIndex);
    const targetText = currentMock?.sampleAnswer ?? "Providing my technical response...";
    let charIndex = 0;

    const timer = setInterval(() => {
      charIndex += 2;
      if (charIndex <= targetText.length) {
        setCandidateTranscript(targetText.slice(0, charIndex));
      } else {
        clearInterval(timer);
      }
    }, 90);

    return () => {
      clearInterval(timer);
    };
  }, [orbState, questionIndex]);

  // ─── Load initial question on start ──────────────────────────
  useEffect(() => {
    if (status !== "active" && status !== "starting") return;
    if (currentQuestion) return;

    async function loadFirst() {
      const { question } = await getInterviewState(0);
      if (question) {
        setQuestion({
          questionNumber: question.questionNumber,
          question,
        });
      }
    }

    loadFirst();
  }, [status, currentQuestion, setQuestion]);

  // ─── Core State Machine Transitions ──────────────────────────

  const advanceToProcessing = useCallback(() => {
    clearTimers();
    setOrbState("PROCESSING");
    submitAnswer();

    if (interviewId && currentQuestion) {
      submitResponse(
        interviewId,
        currentQuestion.id ?? `q_${questionIndex}`,
        candidateTranscript || "[candidate response]",
      );
    }
  }, [clearTimers, submitAnswer, interviewId, currentQuestion, questionIndex, candidateTranscript]);

  const toggleListening = useCallback(() => {
    if (orbState === "LISTENING") {
      advanceToProcessing();
    } else if (orbState === "AI_SPEAKING") {
      clearTimers();
      setAnswerSeconds(0);
      setCandidateTranscript("");
      setOrbState("LISTENING");
    }
  }, [orbState, advanceToProcessing, clearTimers]);

  const skipQuestion = useCallback(async () => {
    clearTimers();
    const nextIndex = questionIndex + 1;
    if (nextIndex >= MOCK_QUESTIONS.length) {
      setCompleted({
        overallScore: 88,
        summary: "Interview session concluded.",
      });
      return;
    }

    setQuestionIndex(nextIndex);
    const { question } = await getInterviewState(nextIndex);
    if (question) {
      setQuestion({
        questionNumber: question.questionNumber,
        question,
      });
      setAnswerSeconds(0);
      setCandidateTranscript("");
      setOrbState("AI_SPEAKING");
    }
  }, [clearTimers, questionIndex, setCompleted, setQuestion]);

  const confirmEndInterview = useCallback(async () => {
    clearTimers();
    setIsEndDialogOpen(false);
    if (interviewId) {
      await endInterviewService(interviewId);
    }
    setCompleted({
      overallScore: 85,
      summary: "Interview ended early by candidate.",
    });
  }, [clearTimers, interviewId, setCompleted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  // ─── Auto advance timer loop ──────────────────────────────────
  useEffect(() => {
    if (status !== "active") return;

    clearTimers();

    if (orbState === "AI_SPEAKING") {
      stateTimerRef.current = setTimeout(() => {
        setAnswerSeconds(0);
        setCandidateTranscript("");
        setOrbState("LISTENING");
      }, 4500);
    } else if (orbState === "LISTENING") {
      stateTimerRef.current = setTimeout(() => {
        advanceToProcessing();
      }, 12000);
    } else if (orbState === "PROCESSING") {
      stateTimerRef.current = setTimeout(() => {
        setOrbState("THINKING");
      }, 1400);
    } else if (orbState === "THINKING") {
      stateTimerRef.current = setTimeout(async () => {
        const nextIndex = questionIndex + 1;
        if (nextIndex >= MOCK_QUESTIONS.length) {
          setCompleted({
            overallScore: 92,
            feedback: "Outstanding technical articulation, depth in architecture, and clear debugging methodologies.",
            summary: "Completed all technical interview questions with high confidence.",
          });
          return;
        }

        setQuestionIndex(nextIndex);
        const { question } = await getInterviewState(nextIndex);
        if (question) {
          setQuestion({
            questionNumber: question.questionNumber,
            question,
          });
          setAnswerSeconds(0);
          setCandidateTranscript("");
          setOrbState("AI_SPEAKING");
        }
      }, 1800);
    }

    return clearTimers;
  }, [orbState, status, questionIndex, clearTimers, advanceToProcessing, setCompleted, setQuestion]);

  // Format mm:ss
  const formattedTime = `${String(Math.floor(elapsedSeconds / 60)).padStart(2, "0")}:${String(
    elapsedSeconds % 60,
  ).padStart(2, "0")}`;

  const formattedAnswerTime = `${String(Math.floor(answerSeconds / 60)).padStart(2, "0")}:${String(
    answerSeconds % 60,
  ).padStart(2, "0")}`;

  return {
    orbState,
    currentQuestion,
    interviewType: MOCK_INTERVIEW_CONFIG.type,
    role: MOCK_INTERVIEW_CONFIG.role,
    difficulty: MOCK_INTERVIEW_CONFIG.difficulty,
    questionIndex,
    totalQuestions: MOCK_QUESTIONS.length,
    elapsedSeconds,
    formattedTime,
    answerSeconds,
    formattedAnswerTime,
    isMuted,
    toggleMute,
    candidateTranscript,
    isEndDialogOpen,
    setIsEndDialogOpen,
    toggleListening,
    skipQuestion,
    confirmEndInterview,
  };
}
