const { processResume } = require("../../services/resume/resumeService");
const {
  ResumePreprocessingChain,
} = require("../../components/langchain/chains/ResumePreProcessing.parallel.chain");

const resumeUploadController = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Resume pdf is required" });
    }

    // returns the cleaned resume text from the pdf buffer with no extra tabs or spaces and also removes any extra new lines
    const cleanResume = await processResume(req.file.buffer);

    /*
      result returns an object with the following structure:
      result.structuredResume is an object containing the structured resume data
      and result.embeddings is an array of embeddings for the resume
    */
    const result = await ResumePreprocessingChain.invoke({
      resume: cleanResume,
    });

    /*todo: Here we have to implement storing of this structured output into the pg db and same goes for embedding*/

    return res.status(200).json({
      success: true,
      cleanResume,
      message: "Resume processed successfully",
    });
  } catch (err) {
    console.log("Error in resumeUploadController:", err);
    return { success: false, message: "Error in resumeUploadController" };
  }
};

module.exports = { resumeUploadController };
