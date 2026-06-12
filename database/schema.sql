-- 1. DROP EXISTING TABLES (Safely resets the database during development)
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS project_members CASCADE;
DROP TABLE IF EXISTS project_skills CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS user_skills CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. CORE ENTITIES

-- User table: for user profiles
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Skills table
CREATE TABLE skills (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL
);

-- Projects table, where all collabs will take place
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  duration VARCHAR(50),
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Skills: Links developers to their specific tech proficiencies
CREATE TABLE user_skills (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, skill_id)
);

-- Project Skills: Links projects to the specific tech skills they require
CREATE TABLE project_skills (
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  skill_id INTEGER REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, skill_id)
);

-- Project Members
CREATE TABLE project_members (
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'Member',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (project_id, user_id)
);

-- Tasks table
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'To Do' CHECK (status IN ('To Do', 'In Progress', 'Completed')),
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Applications table, where devs will apply to contribute to projects
CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  applicant_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  note TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(project_id, applicant_id) -- Prevents spamming requests
);