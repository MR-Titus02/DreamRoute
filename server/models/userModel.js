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
