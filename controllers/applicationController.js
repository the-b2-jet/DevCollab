const Application = require('../models/Application');
const db = require('../config/db');

exports.submit = async (req, res) => {
  try {
    const { projectId: pId } = req.params;
    const { note } = req.body;

    const { rows } = await db.query('select owner_id from projects where id = $1', [pId]);
    if (rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    if (rows[0].owner_id === req.user.id) return res.status(400).json({ error: 'Cannot apply to your own project' });

    const app = await Application.create(pId, req.user.id, note);
    res.status(201).json(app);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
};

exports.getByProject = async (req, res) => {
  try {
    const { projectId: pId } = req.params;
    const { rows } = await db.query('select owner_id from projects where id = $1', [pId]);
    if (rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    if (rows[0].owner_id !== req.user.id) return res.status(403).json({ error: 'Only project owner can view applications' });

    const apps = await Application.getByProjectId(pId);
    res.json(apps);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
};

exports.accept = async (req, res) => {
  try {
    const { id: appId } = req.params;
    const app = await Application.getById(appId);
    if (!app) return res.status(404).json({ error: 'Application not found' });

    const { rows } = await db.query('select owner_id from projects where id = $1', [app.project_id]);
    if (rows[0]?.owner_id !== req.user.id) return res.status(403).json({ error: 'Only project owner can accept' });

    const result = await Application.accept(appId);
    res.json({ message: 'Application accepted', ...result });
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
};

exports.reject = async (req, res) => {
  try {
    const { id: appId } = req.params;
    const app = await Application.getById(appId);
    if (!app) return res.status(404).json({ error: 'Application not found' });

    const { rows } = await db.query('select owner_id from projects where id = $1', [app.project_id]);
    if (rows[0]?.owner_id !== req.user.id) return res.status(403).json({ error: 'Only project owner can reject' });

    const updated = await Application.reject(appId);
    res.json(updated);
  } catch (err) { console.error(err); res.status(500).json({ error: 'Server error' }); }
};
