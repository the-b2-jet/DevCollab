const db = require('../config/db');

const Application = {
  async create(pId, uId, note) {
    const q = 'insert into applications (project_id, applicant_id, note) values ($1, $2, $3) returning *';
    const { rows } = await db.query(q, [pId, uId, note]);
    return rows[0];
  },

  async getByProjectId(pId) {
    const q = 'select a.*, u.full_name as "applicant_name", u.email as "applicant_email" from applications a join users u on a.applicant_id = u.id where a.project_id = $1 order by a.created_at desc';
    const { rows } = await db.query(q, [pId]);
    return rows;
  },

  async getById(appId) {
    const q = 'select * from applications where id = $1';
    const { rows } = await db.query(q, [appId]);
    return rows[0];
  },

  async accept(appId) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      
      const q1 = `update applications set status = 'accepted' where id = $1 returning project_id, applicant_id`;
      const { rows } = await client.query(q1, [appId]);
      if (rows.length === 0) throw new Error('Application not found');
      const { project_id, applicant_id } = rows[0];

      const q2 = `insert into project_members (project_id, user_id, role) values ($1, $2, 'Member') on conflict (project_id, user_id) do nothing`;
      await client.query(q2, [project_id, applicant_id]);

      await client.query('COMMIT');
      return { project_id, applicant_id };
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  async reject(appId) {
    const q = `update applications set status = 'rejected' where id = $1 returning *`;
    const { rows } = await db.query(q, [appId]);
    return rows[0];
  }
};

module.exports = Application;
