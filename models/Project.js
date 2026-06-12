const db = require('../config/db');

const Project = {
  async create({ title, description, duration, owner_id }) {
    const query = `
      INSERT INTO projects (title, description, duration, owner_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const { rows } = await db.query(query, [title, description, duration, owner_id]);
    return rows[0];
  },

  async findAll() {
    const query = `
      SELECT p.*, u.full_name AS owner_name
      FROM projects p
      JOIN users u ON p.owner_id = u.id
      ORDER BY p.created_at DESC
    `;
    const { rows } = await db.query(query);
    return rows;
  },

  async findById(id) {
    const query = `
      SELECT p.*, u.full_name AS owner_name, u.email AS owner_email
      FROM projects p
      JOIN users u ON p.owner_id = u.id
      WHERE p.id = $1
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  },

  async getMembers(projectId) {
    const query = `
      SELECT u.id, u.full_name, u.email, pm.role, pm.joined_at
      FROM project_members pm
      JOIN users u ON pm.user_id = u.id
      WHERE pm.project_id = $1
    `;
    const { rows } = await db.query(query, [projectId]);
    return rows;
  },

  async getSkills(projectId) {
    const query = `
      SELECT s.id, s.name
      FROM project_skills ps
      JOIN skills s ON ps.skill_id = s.id
      WHERE ps.project_id = $1
    `;
    const { rows } = await db.query(query, [projectId]);
    return rows;
  },

  async getTasks(projectId) {
    const query = `
      SELECT t.*, u.full_name AS assigned_to_name
      FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.project_id = $1
      ORDER BY t.created_at
    `;
    const { rows } = await db.query(query, [projectId]);
    return rows;
  },

  async update(id, { title, description, duration }) {
    const query = `
      UPDATE projects
      SET title = $1, description = $2, duration = $3
      WHERE id = $4
      RETURNING *
    `;
    const { rows } = await db.query(query, [title, description, duration, id]);
    return rows[0];
  },

  async delete(id) {
    const query = 'DELETE FROM projects WHERE id = $1 RETURNING *';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  },

  async isOwner(projectId, userId) {
    const query = 'SELECT owner_id FROM projects WHERE id = $1';
    const { rows } = await db.query(query, [projectId]);
    return rows.length > 0 && rows[0].owner_id === userId;
  },

  async addSkill(projectId, skillId) {
    const query = 'INSERT INTO project_skills (project_id, skill_id) VALUES ($1, $2) RETURNING *';
    const { rows } = await db.query(query, [projectId, skillId]);
    return rows[0];
  },

  async removeSkill(projectId, skillId) {
    const query = 'DELETE FROM project_skills WHERE project_id = $1 AND skill_id = $2 RETURNING *';
    const { rows } = await db.query(query, [projectId, skillId]);
    return rows[0];
  }
};

module.exports = Project;
