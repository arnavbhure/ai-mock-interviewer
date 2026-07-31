const { pool } = require("../../config/db");

const getUserByEmail = async (email) => {
  const query = `SELECT id , name , email , password_hash , is_verified , created_at FROM users WHERE email = $1`;
  const values = [email];

  const result = await pool.query(query, values);
  return result.rows[0];
};

const getUserById = async (id) => {
  const query =
    "SELECT id , name , email , password_hash , is_verified , created_at  FROM users WHERE id = $1";
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

module.exports = { getUserByEmail, getUserById };
