require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Routs
app.use('/', require('./routes/viewRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/projects', require('./routes/projectRoutes'));
app.use('/skills', require('./routes/skillRoutes'))
app.use('/members', require('./routes/memberRoutes'));
app.use('/my-skills', require('./routes/userSkillRoutes'));
app.use('/tasks', require('./routes/taskRoutes'));
app.use('/applications', require('./routes/applicationRoutes'));

app.get('/', (req, res) => {
  res.render('layout',{
    title: 'Home',
    view: 'pages/index'
  })
});

const jwt = require('jsonwebtoken');
app.use((req, res, next) => {
  const authHeader = req.header('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
      res.locals.user = decoded;
    } catch (e) {}
  }
  next();
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on : http://localhost:${PORT}`));
