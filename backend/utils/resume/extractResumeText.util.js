const { getDocument } = require("pdfjs-dist/legacy/build/pdf.mjs");

const extractResumeText = async (buffer) => {
  try {
    const loadingTask = getDocument({
      data: new Uint8Array(buffer),
    });

    const pdf = await loadingTask.promise;

    let extractedText = "";

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);

      const content = await page.getTextContent();

      const pageText = content.items.map((item) => item.str).join(" ");

      extractedText += pageText + "\n";
    }

    return extractedText;
  } catch (error) {
    throw new Error("Failed to extract resume text.");
  }
};

module.exports = { extractResumeText };
