const db = require('../config/db')
const Task = {
  async getByProjectId(pId){
    const q = 'select t.*, u.full_name as "assiToName" from tasks t left join users u on t.assigned_to = u.id where t.project_id = $1 order by t.created_at desc';
    const {rows} = await db.query(q, [pId]);
    return rows;
  },
  async getById(tId){
    const q = 'select * from tasks where id = $1';
    const {rows} = await db.query(q, [tId]);
    return rows[0];
  },
  async create(pId, title, desc, dueDate, assiTo){
    const q = `
      insert into tasks (project_id, title, description, due_date, assigned_to) 
      values ($1, $2, $3, $4, $5)
      returning *`
    const {rows} = await db.query(q, [pId, title, desc, dueDate, assiTo]);
    return rows[0];
  },
  async update(tId, fields){
    const {title, desc, due_date, assi_to} = fields;
    const q = 'update tasks set title = $1, description = $2, due_date = $3, assigned_to = $4 where id = $5 returning *';
    const {rows} = await db.query(q, [title, desc, due_date, assi_to, tId]);
    return rows[0];
  },
  async updateStatus(tId, newStatus){
    const q = 'update tasks set status = $1 where id = $2 returning *';
    const {rows} = await db.query(q, [newStatus, tId]);
    return rows[0];
  },
  async delete(tId){
    const q = 'delete from tasks where id = $1 returning *';
    const {rows} = await db.query(q, [tId]);
    return rows[0];
  },
  async getProjectIdOfTask(tId){
    const q = 'select project_id from tasks where id = $1';
    const {rows} = await db.query(q, [tId]);
    return rows[0]?.project_id;
  }
}

module.exports = Task;
