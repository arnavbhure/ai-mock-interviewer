const { QuestionGeneratorChain } = require("../chains/questionGenerator.chain");

const generateQuestionNode = async (state) => {
  const currentRound =
    state.interviewPlan.rounds[state?.currentRoundNumber - 1];

  const result = await QuestionGeneratorChain.invoke({
    role: state.role,
    difficulty: state.difficulty,
    currentRound: currentRound.displayName,
    objective: currentRound.objective,
    roundDifficulty: currentRound.difficulty,
    focusAreas: currentRound.focusAreas.join(", "),
    questionNumber: state.currentQuestion,
    resumeContext: state.resumeContext ?? "",
    conversationHistory: JSON.stringify(state.conversationHistory ?? []),
    evaluationHistory: JSON.stringify(state.evaluationHistory ?? []),
  });

  return { currentQuestionData: result };
};

module.exports = { generateQuestionNode };

/* 
this node returns : 
    {
  roundNumber: 1,
  roundType: 'resume',
  difficulty: 'easy',
  displayName: 'Resume Overview',
  objective: 'Understand candidate background, discuss projects, verify resume authenticity, and evaluate technical decisions.',
  numberOfQuestions: 3,
  focusAreas: []
}
{
  currentQuestionData: {
    question: "Can you tell me about a project you've worked on that you're particularly proud of, and what role did you play in its development?",
    questionType: 'project',
    focusArea: 'projects and background',
    expectedSkills: [ 'MERN stack', 'project experience', 'technical decision-making' ]
  }
}
*/
