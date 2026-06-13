const db = require('../config/db');

const Member = {
  async getByProject(projectId) {
    const query = `
      SELECT pm.*, u.full_name, u.email
      FROM project_members pm
      JOIN users u ON pm.user_id = u.id
      WHERE pm.project_id = $1
      ORDER BY pm.joined_at
    `;
    const { rows } = await db.query(query, [projectId]);
    return rows;
  },

  async add(projectId, userId, role = 'Member') {
    const query = `
      INSERT INTO project_members (project_id, user_id, role)
      VALUES ($1, $2, $3)
      ON CONFLICT (project_id, user_id) DO UPDATE SET role = $3
      RETURNING *
    `;
    const { rows } = await db.query(query, [projectId, userId, role]);
    return rows[0];
  },

  async remove(projectId, userId) {
    const query = `
      DELETE FROM project_members
      WHERE project_id = $1 AND user_id = $2
      RETURNING *
    `;
    const { rows } = await db.query(query, [projectId, userId]);
    return rows[0];
  },

  async updateRole(projectId, userId, newRole) {
    const query = `
      UPDATE project_members
      SET role = $3
      WHERE project_id = $1 AND user_id = $2
      RETURNING *
    `;
    const { rows } = await db.query(query, [projectId, userId, newRole]);
    return rows[0];
  },

  async isMember(projectId, userId) {
    const query = 'SELECT 1 FROM project_members WHERE project_id = $1 AND user_id = $2';
    const { rows } = await db.query(query, [projectId, userId]);
    return rows.length > 0;
  }
};

module.exports = Member;
