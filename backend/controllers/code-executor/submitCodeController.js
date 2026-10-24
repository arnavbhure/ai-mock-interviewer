const {
  checkInterviewModel,
} = require("../../models/interview/checkInterviewModel");
const {
  codeExecutionService,
} = require("../../services/dsa/codeExecution.service");

const submitCodeController = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized", success: false });
    }
    const { code, language, interviewId, problemId } = req.body;
    if (!code || !language || !interviewId || !problemId) {
      return res.status(400).json({
        message:
          "Please provide code , Problem id and language to submit the code.",
        success: false,
      });
    }
    const is_valid_interview = await checkInterviewModel(interviewId, user.id);
    if (!is_valid_interview) {
      return res.status(400).json({
        message: "Invalid interview.",
        success: false,
      });
    }

    /*
        todo : here we have to fetch the hidden test cases from the db with 
        there expected output and then we have to run the code 
    */

    const test_cases = []; // dummy for now
    const expected_output = []; // dummy for now untill implementation of fetching hidden test cases from db is done

    const code_execution_result = await codeExecutionService({
      code,
      language,
      test_cases: test_cases.map((test, index) => ({
        // check the implementation of this mapping first
        input: test.input ?? "",
        expected_output: expected_output[index] ?? "",
        hidden: true,
      })),
    });

    return res.status(200).json({
      message: "Code submitted successfully.",
      success: true,
      data: code_execution_result,
    });
  } catch (err) {
    console.log("Error in submitCodeController : ", err);
    return res
      .status(500)
      .json({ message: "Failed to submit code.", success: false });
  }
};

module.exports = { submitCodeController };
