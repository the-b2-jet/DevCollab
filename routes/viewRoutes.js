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

router.get('/projects/new', (req, res) => {
  if (!res.locals.user) return res.redirect('/login');
  res.render('layout', { title: 'New Project', view: 'projects/new' });
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

router.get('/projects/:id/applications', async (req, res) => {
  if (!res.locals.user) return res.redirect('/login');

  const projectId = req.params.id;

  const { rows: ownerRows } = await pool.query(
    'SELECT owner_id FROM projects WHERE id = $1',
    [projectId]
  );
  if (ownerRows.length === 0) return res.status(404).send('Project not found');
  if (ownerRows[0].owner_id !== res.locals.user.id) {
    return res.status(403).send('Only the project owner can view applications');
  }

  const { rows: applications } = await pool.query(
    `SELECT a.*, u.full_name AS applicant_name, u.email AS applicant_email
     FROM applications a
     JOIN users u ON a.applicant_id = u.id
     WHERE a.project_id = $1
     ORDER BY a.created_at DESC`,
    [projectId]
  );

  const applicantIds = applications.map(app => app.applicant_id);
  let skillsByUser = {};
  if (applicantIds.length > 0) {
    const { rows: skills } = await pool.query(
      `SELECT us.user_id, s.name
       FROM user_skills us
       JOIN skills s ON us.skill_id = s.id
       WHERE us.user_id = ANY($1)`,
      [applicantIds]
    );
    skills.forEach(skill => {
      if (!skillsByUser[skill.user_id]) skillsByUser[skill.user_id] = [];
      skillsByUser[skill.user_id].push(skill.name);
    });
  }

  const { rows: projectRows } = await pool.query('SELECT title FROM projects WHERE id = $1', [projectId]);
  const project = projectRows[0];

  res.render('layout', {
    title: 'Applications',
    view: 'projects/applications',
    project,
    applications,
    skillsByUser
  });
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

router.get('/discover', async (req, res) => {
  const query = req.query.q || '';
  let results = [];
  if (query.trim()) {
    try {
        const { rows } = await pool.query(
        `SELECT p.id, p.title, p.description, p.created_at,
                STRING_AGG(s.name, ', ') AS skills
         FROM projects p
         LEFT JOIN project_skills ps ON p.id = ps.project_id
         LEFT JOIN skills s ON ps.skill_id = s.id
         WHERE p.title ILIKE $1 OR p.description ILIKE $1 OR s.name ILIKE $1
         GROUP BY p.id, p.created_at
         ORDER BY p.created_at DESC`,
        [`%${query}%`]
      );
      results = rows;
    } catch (err) {
      console.error(err);
    }
  }
  res.render('layout', {
    title: 'Discover',
    view: 'discover/index',
    query,
    results
  });
});

module.exports = router;
