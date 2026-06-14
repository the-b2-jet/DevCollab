# DevCollab

## A platform where developers can:  
	- Pitch project ideas, 
	- Recruit teammates based off of technical skills, 
	- Create MINI-tasks, 
	- Manage contributors, 
	- Track project progress

Built using Node.js, Express, and PostgreSQL, the application uses an MVC-style architecture with EJS for dynamic frontend rendering.

## Core Features

- **Authentication & Security:** JWT-based authentication with encrypted passwords ('bcryptjs'). Custom middleware handles route protection and project ownership verification.
- **Team Formation:** Students can apply to join projects. Project owners can review incoming applications, check applicant skills, and accept or reject them.
- **Skill Matching:** Many-to-many r/ship mapping user skills against project requirements to help find the right contributors.
- **Task Board:** A lightweight, dynamic task management system to delegate micro-tasks and track project lifecycles.
- **Search & Filters:** A simple discovery feed to search for projects by title, description, or required technologies.
- **SSR Architecture:** Clean frontend structure using EJS master layouts and reusable partials ('head', 'navbar', 'footer') for consistent UI rendering.

## Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL (Relational)
* **Templating:** EJS (Embedded JavaScript)
* **Auth & Security:** JSON Web Tokens (JWT), bcryptjs

---

## Environment Variables

Create a **.env** file in the root directory based on the following template:

```env
JWT_SECRET=your_jwt_secret_key_here

# PostgreSQL Configuration

DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=devcollab
DB_PASSWORD=your_db_password
DB_PORT=5432
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL instance running locally

### Installation

1. Clone the repository:
```bash
git clone https://github.com/the-b2-jet/DevCollab.git
cd DevCollab
```
2. Install dependencies:
```bash
npm install
```
3. Set up the database:
* Create a local PostgreSQL database named  **devcollab**.
* Configure your **.env** file with your local database credentials.

You can use the .env.example and populate it with the right configs: 
```bash 
 cp .env.example .env
```
* Run the initialization script to setup the db schemas:
```bash
npm run db:setup
```


4. Run the application:
```bash
# Production mode

=> npm start

# Development mode (with nodemon, if configured)

=> npm run dev
```
5. Access the app:
Open http://localhost:3000 in your browser.
