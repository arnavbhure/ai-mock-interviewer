const { llm } = require("./config/llm");

const test = async () => {
  const response = await llm.invoke("Hello, how are you?");
  console.log("Response from LLM:", response);
  console.log("Response type:", typeof response);
  console.log(response.content);
};

test();
