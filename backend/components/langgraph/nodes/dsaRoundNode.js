const {
  reservedDSAquestionModel,
} = require("../../../models/dsaProblems/reservedDSAquestion.model");
const { interrupt } = require("@langchain/langgraph");

// Active problem reservation cache to prevent re-reserving on graph interrupt-resume replay
const activeDsaReservations = new Map();

const dsaRoundNode = async (state) => {
  const interviewKey = String(state.interviewId || "default");
  let reservedProblem = activeDsaReservations.get(interviewKey);

  if (!reservedProblem) {
    reservedProblem = await reservedDSAquestionModel({
      difficulty: state.currentDifficulty,
      ids: state.DSAreservedQuestionsID || [],
    });

    if (!reservedProblem) {
      throw new Error("No reserved DSA question found for the given difficulty.");
    }
    activeDsaReservations.set(interviewKey, reservedProblem);
  }

  // Interrupt graph execution and wait for candidate submission or skip
  const result = interrupt({
    type: "dsa_round",
    problem: reservedProblem,
    interviewId: state.interviewId,
    currentQuestionNumber: state.currentQuestionNumber,
  });

  // Resumed: clear cache for this interview session
  activeDsaReservations.delete(interviewKey);

  const evaluation = result?.evaluation || result;
  const problemId = result?.problemId || reservedProblem.id;

  // Format score for LangGraph state (0-10 scale)
  const rawScore = evaluation?.score;
  const normalizedScore =
    typeof rawScore === "number"
      ? rawScore > 10
        ? Math.round((rawScore / 10) * 10) / 10
        : rawScore
      : 7;

  const topic =
    (Array.isArray(reservedProblem.topics)
      ? reservedProblem.topics[0]
      : reservedProblem.topics) || "Data Structures & Algorithms";

  const dsaScoreEntry = {
    roundIndex: Math.max(0, (state.currentRoundNumber || 1) - 1),
    questionNumber: state.currentQuestionNumber || 1,
    score: normalizedScore,
    difficulty: state.currentDifficulty || "medium",
    topic: String(topic),
  };

  const existingReserved = Array.isArray(state.DSAreservedQuestionsID)
    ? state.DSAreservedQuestionsID
    : [];

  return {
    lastEvaluation: evaluation,
    questionScores: [...(state.questionScores || []), dsaScoreEntry],
    DSAreservedQuestionsID: [...existingReserved, problemId],
    currentAnswer: null,
    currentQuestion: null,
    phase: "round_transition",
  };
};

module.exports = { dsaRoundNode };
