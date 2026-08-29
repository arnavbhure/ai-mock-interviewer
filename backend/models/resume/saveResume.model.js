const { pool } = require("../../config/db.js");

const saveResumeModel = async (data) => {
  const query = `
    INSERT INTO candidate_resumes (
      user_id,
      full_name,
      phone,
      summary,
      skills,
      education,
      experience,
      projects,
      achievements
    )
    VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9
    )
    ON CONFLICT (user_id)
    DO UPDATE SET
      full_name = EXCLUDED.full_name,
      phone = EXCLUDED.phone,
      summary = EXCLUDED.summary,
      skills = EXCLUDED.skills,
      education = EXCLUDED.education,
      experience = EXCLUDED.experience,
      projects = EXCLUDED.projects,
      achievements = EXCLUDED.achievements,
      updated_at = NOW()
    RETURNING *;
  `;

  const values = [
    data.id,
    data.fullName,
    data.phone,
    data.summary,
    data.skills,
    data.education,
    data.experience,
    data.projects,
    data.achievements,
  ];

  const { rows } = await pool.query(query, values);

  return rows[0];
};

module.exports = { saveResumeModel };
