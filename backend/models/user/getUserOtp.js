const { pool } = require("../../config/db");

const getUserOtp = async (email) => {
  const query =
    "SELECT  id , email , otp, otp_expires_at FROM users WHERE email = $1";
  const values = [email];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const markAsVerified = async (userId) => {
  const query = `UPDATE users SET is_verified = TRUE, otp = NULL, otp_expires_at = NULL WHERE id = $1 RETURNING *`;
  const values = [userId];

  const result = await pool.query(query, values);
  return result.rowCount > 0;
};

module.exports = { getUserOtp, markAsVerified };
