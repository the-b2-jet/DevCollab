const db = require('../config/db');

const UserSkill = {
  async getByUser(userId) {
    const query = `
      SELECT s.id, s.name
      FROM user_skills us
      JOIN skills s ON us.skill_id = s.id
      WHERE us.user_id = $1
      ORDER BY s.name
    `;
    const { rows } = await db.query(query, [userId]);
    return rows;
  },

  async add(userId, skillId) {
    const query = `
      INSERT INTO user_skills (user_id, skill_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, skill_id) DO NOTHING
      RETURNING *
    `;
    const { rows } = await db.query(query, [userId, skillId]);
    return rows[0];
  },

  async remove(userId, skillId) {
    const query = `
      DELETE FROM user_skills
      WHERE user_id = $1 AND skill_id = $2
      RETURNING *
    `;
    const { rows } = await db.query(query, [userId, skillId]);
    return rows[0];
  }
};

module.exports = UserSkill;
