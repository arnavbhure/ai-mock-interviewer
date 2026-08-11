const {
  getInterviewPlanModel,
} = require("../../models/interview/getInterviewPlan");
const { initialState } = require("./state/intialise_state");

const initializeInterview = async () => {
  const userId = req.user;

  const interview = await getInterviewPlanModel(userId);

  return initialState(interview);
};

module.exports = { initializeInterview };
