// models/userModel.js
import db from '../config/db.js';

export async function createUser(name, email, passwordHash, role) {
  const sql = 'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?, ?)';
  const [result] = await db.execute(sql, [name, email, passwordHash, role]);
  return result;
}

export async function findUserByEmail(email) {
  const sql = 'SELECT * FROM users WHERE email = ?';
  const [rows] = await db.execute(sql, [email]);
  return rows[0]; // return first user found or undefined
}
