const cleanResumeText = (text) => {
  return (
    text

      // normalize line endings
      .replace(/\r\n/g, "\n")

      // remove tabs
      .replace(/\t/g, " ")

      // remove zero-width chars
      .replace(/[\u200B-\u200D\uFEFF]/g, "")

      // collapse multiple spaces
      .replace(/[ ]{2,}/g, " ")

      // collapse 3+ newlines into 2
      .replace(/\n{3,}/g, "\n\n")

      // trim every line
      .split("\n")
      .map((line) => line.trim())
      .join("\n")

      // trim final result
      .trim()
  );
};

module.exports = { cleanResumeText };
