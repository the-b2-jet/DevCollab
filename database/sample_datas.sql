-- This is a sample data only, just for development 
-- sample skills
INSERT INTO skills (name) VALUES
  ('Node.js'),
  ('Express.js'),
  ('PostgreSQL'),
  ('EJS'),
  ('UI Design'),
  ('Git & GitHub'),
  ('React'),
  ('Python');

-- sample users
INSERT INTO users (full_name, email, bio, password) VALUES
  ('Abebe test1', 'abebe@example.com', 'Full-stack developer and team lead.', '$2b$10$kS2Ngnce7XvcCRCkyekRg.F1.oFy79byuPB5SjHsBAkELBmRH5hqC'), --password: password1
  ('Kebede test2', 'kebede@example.com', 'UI/UX designer.', '$2b$10$Qt.Vretk.nEK4YfoKe88oue48PmenUvmt1y41C95rFLJn6LtXHOG6'), -- password: password2
  ('Natnael test3', 'natnael@example.com', 'Backend engineer. Databases. APIs.', '$2b$10$p9PvPJl9JiM.CzTamPxgBehbKquGKuyI1Xpkcn584Xb32.eJ/VHLa'); -- password: password3

-- users to skills linking
INSERT INTO user_skills (user_id, skill_id) VALUES
  (1, 1), (1, 2), (1, 3),   -- Abebe: Node, Express, PostgreSQL
  (2, 5), (2, 6),           -- Kebede: UI Design, Git
  (3, 1), (3, 3), (3, 7);   -- Natnael: Node, PostgreSQL, React

-- a sample project (owner is user 1, Abebe)
INSERT INTO projects (title, description, duration, owner_id) VALUES
  ('Campus Event Manager', 'A platform to manage university events, RSVPs, and scheduling.', '4 weeks', 1);

-- required skills for this project (needs Node.js, Express, PostgreSQL, UI Design)
INSERT INTO project_skills (project_id, skill_id) VALUES
  (1, 1), (1, 2), (1, 3), (1, 5);

-- Devs to the project (Abebe as owner & member, Kebede as UI Designer)
INSERT INTO project_members (project_id, user_id, role) VALUES
  (1, 1, 'Project Lead'),
  (1, 2, 'UI Designer');

-- sample tasks
INSERT INTO tasks (project_id, assigned_to, title, description, status, due_date) VALUES
  (1, 2, 'Design landing page', 'Create wireframe and high-fidelity mockup.', 'In Progress', '2026-06-20'),
  (1, 1, 'Set up database', 'Design ERD and create PostgreSQL schema.', 'Completed', '2026-06-15'),
  (1, NULL, 'Write documentation', 'Prepare README and API docs.', 'To Do', '2026-06-25');

-- pending application from Natnael to the project
INSERT INTO applications (project_id, applicant_id, note, status) VALUES
  (1, 3, 'I am good with backend and React. Can I join?', 'pending');