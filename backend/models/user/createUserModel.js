const { pool } = require("../../config/db");

const createUserModel = async (user) => {
  const { name, email, password_hash, otp, otpExpiresAt } = user;
  const query = `
    INSERT INTO users (
      name,
      email,
      password_hash,
      otp,
      otp_expires_at
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const values = [name, email, password_hash, otp, otpExpiresAt];

  const { rows } = await pool.query(query, values);

  return rows[0];
};

module.exports = { createUserModel };
