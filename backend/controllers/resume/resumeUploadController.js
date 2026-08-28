const { processResume } = require("../../services/resume/resumeService");
const {
  ResumePreprocessingChain,
} = require("../../components/langchain/chains/ResumePreProcessing.parallel.chain");
const { saveResumeModel } = require("../../models/resume/saveResume.model");
const {
  saveResumeEmbeddingsModel,
} = require("../../models/resume/saveResumeEmbeddings.model");

const resumeUploadController = async (req, res) => {
  try {
    const user = req.user;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Resume pdf is required" });
    }

    // returns the cleaned resume text from the pdf buffer with no extra tabs or spaces and also removes any extra new lines
    const cleanResume = await processResume(req.file.buffer);

    const result = await ResumePreprocessingChain.invoke({
      resume: cleanResume,
    });
    const resumeJson = { id: user.id, ...result?.structuredResume };

    /*
      result returns an object with the following structure:
      result.structuredResume is an object containing the structured resume data
      and result.embeddings is an array of embeddings for the resume
    */

    const resumeStored = await saveResumeModel(resumeJson);

    const resume_id = resumeStored.id;
    const user_id = resumeStored.user_id;

    const embeddingData = result.embeddings.map((embedding) => ({
      user_id,
      resume_id,
      ...embedding,
    }));

    const embeddingsStored = await saveResumeEmbeddingsModel(embeddingData);

    /*in above step ,
      we are saving the structured resume data 
      and embeddings to the database in parallel 
    */

    if (resumeStored && embeddingsStored.stored) {
      return res.status(200).json({
        success: true,
        resume_json: result?.structuredResume,
        message: "Resume processed successfully",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Error in Saving Resume , Please try again later",
    });
  } catch (err) {
    console.log("Error in resumeUploadController:", err);
    return res.status(500).json({
      success: false,
      message: "Error in Saving Resume , Please try again later",
    });
  }
};

module.exports = { resumeUploadController };
