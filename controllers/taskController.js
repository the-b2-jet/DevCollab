const Task = require('../models/Task');
const db = require('../config/db');

exports.getByProject = async (req, res) => {
  try {
    const rows = await Task.getByProjectId(req.params.projectId);
    res.json(rows);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
};

exports.create = async (req, res) => {
  try {
    const { projectId: pId } = req.params;
    const { title, description: desc, due_date: dDate, assigned_to: assiTo } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const { rows } = await db.query('select 1 from project_members where project_id = $1 and user_id = $2', [pId, req.user.id]);
    if (rows.length === 0) return res.status(403).json({ error: 'Only project members can create tasks' });

    const task = await Task.create(pId, title, desc, dDate, assiTo);
    res.status(201).json(task);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
};

exports.update = async (req, res) => {
  try {
    const { id: tId } = req.params;
    const pId = await Task.getProjectIdOfTask(tId);
    if (!pId) return res.status(404).json({ error: 'Task not found' });

    const { rows } = await db.query('select owner_id from projects where id = $1', [pId]);
    if (rows[0]?.owner_id !== req.user.id) return res.status(403).json({ error: 'Only project owner can edit task details' });

    const task = await Task.update(tId, req.body);
    res.json(task);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
};

exports.toggleStatus = async (req, res) => {
  try {
    const { id: tId } = req.params;
    const { status } = req.body;
    if (!['To Do', 'In Progress', 'Completed'].includes(status)) return res.status(400).json({ error: 'Invalid status' });

    const pId = await Task.getProjectIdOfTask(tId);
    if (!pId) return res.status(404).json({ error: 'Task not found' });

    const { rows } = await db.query('select 1 from project_members where project_id = $1 and user_id = $2', [pId, req.user.id]);
    if (rows.length === 0) return res.status(403).json({ error: 'Only project members can update status' });

    const updated = await Task.updateStatus(tId, status);
    res.json(updated);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
};

exports.delete = async (req, res) => {
  try {
    const { id: tId } = req.params;
    const pId = await Task.getProjectIdOfTask(tId);
    if (!pId) return res.status(404).json({ error: 'Task not found' });

    const { rows } = await db.query('select owner_id from projects where id = $1', [pId]);
    if (rows[0]?.owner_id !== req.user.id) return res.status(403).json({ error: 'Only project owner can delete tasks' });

    await Task.delete(tId);
    res.json({ message: 'Task deleted' });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
};
