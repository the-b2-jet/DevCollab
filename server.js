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
app.use('/auth', require('./routes/authRoutes'));
app.use('/projects', require('./routes/projectRoutes'));

app.get('/', (req, res) => {
  res.send('DevCollab is running!');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on : http://localhost:${PORT}`));
