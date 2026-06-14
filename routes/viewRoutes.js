const router = require('express').Router();

// Auth pages
router.get('/login', (req, res) => {
  res.render('layout', { title: 'Login', view: 'auth/login' });
});

router.get('/register', (req, res) => {
  res.render('layout', { title: 'Register', view: 'auth/register' });
});

module.exports = router;
