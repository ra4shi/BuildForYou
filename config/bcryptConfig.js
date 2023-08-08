const bcrypt = require("bcrypt");

const securePassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

module.exports = { securePassword };
