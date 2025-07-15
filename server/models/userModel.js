// models/userModel.js
import pool from '../config/db.js';

export async function getAllUsers() {
  const [rows] = await pool.query('SELECT id, email, role, name, created_at, plan FROM users');
  return rows;
}

export async function getUserById(id) {
  const [rows] = await pool.query('SELECT id, email, role, name, created_at, plan FROM users WHERE id = ?', [id]);
  return rows[0];
}

export async function findUserByEmail(email) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
}

export async function createUser({ name, email, password, role, isProfileComplete, plan = 'free' }) {
  const [result] = await pool.query(
    "INSERT INTO users (name, email, password, role, isProfileComplete, plan) VALUES (?, ?, ?, ?, ?, ?)",
    [name, email, password, role, isProfileComplete, plan]
  );
  return result;
}

// New function to update user plan
export async function updateUserPlan(userId, plan) {
  const [result] = await pool.query(
    "UPDATE users SET plan = ? WHERE id = ?",
    [plan, userId]
  );
  return result;
}
