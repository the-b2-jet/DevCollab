const Member = require('../models/Member');
const pool = require('../config/db');

exports.getMembers = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const members = await Member.getByProject(projectId);
    res.json(members);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.addMember = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const { userId, role } = req.body;

    const ownerCheck = await pool.query('SELECT owner_id FROM projects WHERE id = $1', [projectId]);
    if (ownerCheck.rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    if (ownerCheck.rows[0].owner_id !== req.user.id) {
      return res.status(403).json({ error: 'Only project owner can add members' });
    }

    const member = await Member.add(projectId, userId, role || 'Member');
    res.status(201).json(member);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const userId = parseInt(req.params.userId);

    const ownerCheck = await pool.query('SELECT owner_id FROM projects WHERE id = $1', [projectId]);
    if (ownerCheck.rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    const ownerId = ownerCheck.rows[0].owner_id;
    if (ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Only project owner can remove members' });
    }
    if (userId === ownerId) {
      return res.status(400).json({ error: 'Cannot remove the project owner' });
    }

    const removed = await Member.remove(projectId, userId);
    if (!removed) return res.status(404).json({ error: 'Member not found' });
    res.json({ message: 'Member removed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const userId = parseInt(req.params.userId);
    const { role } = req.body;

    const ownerCheck = await pool.query('SELECT owner_id FROM projects WHERE id = $1', [projectId]);
    if (ownerCheck.rows.length === 0) return res.status(404).json({ error: 'Project not found' });
    if (ownerCheck.rows[0].owner_id !== req.user.id) {
      return res.status(403).json({ error: 'Only project owner can change roles' });
    }

    const updated = await Member.updateRole(projectId, userId, role);
    if (!updated) return res.status(404).json({ error: 'Member not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
