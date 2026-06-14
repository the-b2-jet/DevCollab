const router = require('express').Router();
const pool = require('../config/db');
const Member = require('../models/Member');

router.get('/login', (req, res) => {
  res.render('layout', { title: 'Login', view: 'auth/login' });
});

router.get('/register', (req, res) => {
  res.render('layout', { title: 'Register', view: 'auth/register' });
});


router.get('/projects', async (req, res) => {
  try {
    const { rows: projects } = await pool.query(
      'SELECT * FROM projects ORDER BY created_at DESC'
    );
    res.render('layout', {
      title: 'Projects',
      view: 'projects/list',
      projects
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/projects/:id', async (req, res) => {
  try {
    const { rows: projectRows } = await pool.query(
      'SELECT * FROM projects WHERE id = $1',
      [req.params.id]
    );
    if (projectRows.length === 0) return res.status(404).send('Project not found');
    const project = projectRows[0];

    const { rows: ownerRows } = await pool.query(
      'SELECT full_name, email FROM users WHERE id = $1',
      [project.owner_id]
    );
    const owner = ownerRows[0];

    const { rows: skills } = await pool.query(
      `SELECT s.name FROM skills s
       JOIN project_skills ps ON s.id = ps.skill_id
       WHERE ps.project_id = $1`,
      [project.id]
    );

    const members = await Member.getByProject(project.id);
    const { rows: tasks } = await pool.query(
      `SELECT t.*, u.full_name AS assigned_to_name
       FROM tasks t
       LEFT JOIN users u ON t.assigned_to = u.id
       WHERE t.project_id = $1
       ORDER BY t.created_at`,
      [project.id]
    );

    let isMember = false;
    if (res.locals.user) {
      const { rows: memberCheck } = await pool.query(
        'SELECT 1 FROM project_members WHERE project_id = $1 AND user_id = $2',
        [project.id, res.locals.user.id]
      );
      isMember = memberCheck.length > 0;
    }

    res.render('layout', {
      title: project.title,
      view: 'projects/detail',
      project,
      owner,
      skills,
      members,
      tasks,
      isMember
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/projects/new', (req, res) => {
  if (!res.locals.user) return res.redirect('/login');
  res.render('layout', { title: 'New Project', view: 'projects/new' });
});

router.get('/my-skills', async (req, res) => {
  if (!res.locals.user) return res.redirect('/login');
  try {
    const { rows: userSkills } = await pool.query(
      `SELECT s.id, s.name FROM skills s
       JOIN user_skills us ON s.id = us.skill_id
       WHERE us.user_id = $1 ORDER BY s.name`,
      [res.locals.user.id]
    );
    const { rows: allSkills } = await pool.query('SELECT id, name FROM skills ORDER BY name');
    res.render('layout', {
      title: 'My Skills',
      view: 'my-skills/index',
      userSkills,
      allSkills
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
