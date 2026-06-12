const db = require('../config/db.js');

const Skill = {
  async getAll() {
    const query = 'SELECT id, name FROM skills ORDER BY name';
    const {rows } = await db.query(query);
    return rows;
  }
};

module.exports = Skill;
