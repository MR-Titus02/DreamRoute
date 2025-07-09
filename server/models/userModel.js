// models/userModel.js
import pool from '../config/db.js';

export async function getAllUsers() {
  const [rows] = await pool.query('SELECT id, email, role, name, created_at FROM users');
  return rows;
}

export async function getUserById(id) {
  const [rows] = await pool.query('SELECT id, email, role, name, created_at FROM users WHERE id = ?', [id]);
  return rows[0];
}

export async function findUserByEmail(email) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  return rows[0];
}

export async function createUser({ name, email, password, role, isProfileComplete }) {
  const [result] = await pool.query(
    "INSERT INTO users (name, email, password, role, isProfileComplete) VALUES (?, ?, ?, ?, ?)",
    [name, email, password, role, isProfileComplete]
  );
  return result;
}