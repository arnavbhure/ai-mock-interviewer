const { pool } = require("../../config/db");

const reservedDSAquestionModel = async ({ difficulty, ids = [] }) => {
  const safeIds = Array.isArray(ids) ? ids.filter(Boolean) : [];

  let query = `
    SELECT id, title, difficulty, topics, description, public_tests_source 
    FROM problems
    WHERE difficulty = $1
  `;
  const values = [difficulty];

  if (safeIds.length > 0) {
    query += ` AND NOT (id = ANY($2)) `;
    values.push(safeIds);
  }

  query += ` ORDER BY RANDOM() LIMIT 1;`;

  try {
    const { rows } = await pool.query(query, values);
    if (rows && rows[0]) {
      return rows[0];
    }

    // Fallback: If no problem matches the requested difficulty (or all were reserved),
    // pick any problem excluding reserved IDs so the interview never abruptly crashes.
    let fallbackQuery = `
      SELECT id, title, difficulty, topics, description, public_tests_source 
      FROM problems
    `;
    const fallbackValues = [];

    if (safeIds.length > 0) {
      fallbackQuery += ` WHERE NOT (id = ANY($1)) `;
      fallbackValues.push(safeIds);
    }

    fallbackQuery += ` ORDER BY RANDOM() LIMIT 1;`;
    const fallbackRes = await pool.query(fallbackQuery, fallbackValues);
    return fallbackRes.rows?.[0] || null;
  } catch (err) {
    console.error("Error in reservedDSAquestionModel:", err);
    throw err;
  }
};

module.exports = { reservedDSAquestionModel };
