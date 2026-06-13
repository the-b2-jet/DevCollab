const UserSkill = require('../models/UserSkill');
const pool = require('../config/db');

exports.getMySkills = async (req, res) => {
  try {
    const skills = await UserSkill.getByUser(req.user.id);
    res.json(skills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.addSkill = async (req, res) => {
  try {
    const { skillId } = req.body;
    if (!skillId) return res.status(400).json({ error: 'Skill ID required' });

    const skillCheck = await pool.query('SELECT id FROM skills WHERE id = $1', [skillId]);
    if (skillCheck.rows.length === 0) return res.status(404).json({ error: 'Skill not found' });

    await UserSkill.add(req.user.id, skillId);
    const skills = await UserSkill.getByUser(req.user.id);
    res.status(201).json(skills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.removeSkill = async (req, res) => {
  try {
    const skillId = parseInt(req.params.skillId);
    const removed = await UserSkill.remove(req.user.id, skillId);
    if (!removed) return res.status(404).json({ error: 'Skill not found on your profile' });
    const skills = await UserSkill.getByUser(req.user.id);
    res.json(skills);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
