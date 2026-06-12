const db = require('../config/db');

const findUserByEmail = async (email) => {
  try {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await db.query(query, [email]);
    return rows[0];
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
};

const findUserById = async (id) => {
  try {
    const query = 'SELECT id, full_name, email, bio, created_at FROM users WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  } catch (error) {
    console.error('Error finding user by id:', error);
    throw error;
  }
};

const registerUser = async (user) => {
  try {
    const { full_name, email, password } = user;
    const query = 'INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3) RETURNING *';
    const { rows } = await db.query(query, [full_name, email, password]);
    return rows[0];
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

module.exports = { findUserByEmail, findUserById, registerUser };
