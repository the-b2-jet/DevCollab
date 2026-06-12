const db = require('../config/db.js');

const Skill = {
  async getAll() {
    const query = 'SELECT id, name FROM skills ORDER BY name';
    const {rows} = await db.query(query);
    return rows;
  },
  async create(name) {
    const query = 'INSERT INTO skills (name) VALUES ($1) RETURNING *';
    const {rows} = await db.query(query, [name]);
    return rows[0];
  },
  async findByName(name) {
    const query = 'SELECT * FROM skills WHERE name ILIKE $1';
    const {rows} = await db.query(query, [name]);
    return rows[0];
  }
};

module.exports = Skill;
