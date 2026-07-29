const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (password, storedPasswordHash) => {
  return await bcrypt.compare(password, storedPasswordHash);
};

module.exports = { hashPassword, comparePassword };
