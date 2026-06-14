const router = require('express').Router();
const pool = require('../config/db');
const Member = require('../models/Member');   // we still need this for members list

// ---------- Auth pages ----------
router.get('/login', (req, res) => {
  res.render('layout', { title: 'Login', view: 'auth/login' });
});

router.get('/register', (req, res) => {
  res.render('layout', { title: 'Register', view: 'auth/register' });
});

// ---------- Project pages ----------

// List all projects
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

// Show a single project with details
router.get('/projects/:id', async (req, res) => {
  try {
    // Get project
    const { rows: projectRows } = await pool.query(
      'SELECT * FROM projects WHERE id = $1',
      [req.params.id]
    );
    if (projectRows.length === 0) return res.status(404).send('Project not found');
    const project = projectRows[0];

    // Get owner info
    const { rows: ownerRows } = await pool.query(
      'SELECT full_name, email FROM users WHERE id = $1',
      [project.owner_id]
    );
    const owner = ownerRows[0];

    // Get required skills
    const { rows: skills } = await pool.query(
      `SELECT s.name FROM skills s
       JOIN project_skills ps ON s.id = ps.skill_id
       WHERE ps.project_id = $1`,
      [project.id]
    );

    // Get members
    const members = await Member.getByProject(project.id);

    // Check if current user is a member
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
      isMember
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// New project form (login required)
router.get('/projects/new', (req, res) => {
  if (!res.locals.user) return res.redirect('/login');
  res.render('layout', { title: 'New Project', view: 'projects/new' });
});

module.exports = router;
