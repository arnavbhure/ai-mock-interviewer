const { initializeCheckpointer } = require("./checkpointer");

const startCheckpointer = async () => {
  try {
    await initializeCheckpointer();
  } catch (err) {
    console.log(err);
  }
};

module.exports = { startCheckpointer };
