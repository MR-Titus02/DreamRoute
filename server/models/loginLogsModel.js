import pool from "../config/db.js";

// Create a login log
export async function createLoginLog({ user_id, ip_address, user_agent, status }) {
  const [result] = await pool.query(
    `INSERT INTO login_logs (user_id, ip_address, user_agent, status) VALUES (?, ?, ?, ?)`,
    [user_id, ip_address, user_agent, status]
  );
  return result.insertId;
}

// Get all logs (with user info)
export async function getAllLogs() {
  const [rows] = await pool.query(`
    SELECT 
      l.*, 
      u.name, 
      u.email,
      u.role
    FROM login_logs l
    JOIN users u ON l.user_id = u.id
    ORDER BY l.created_at DESC
  `);
  return rows;
}

// Get logs by user ID (with user info)
export async function getLogsByUser(user_id) {
  const [rows] = await pool.query(`
    SELECT 
      l.*, 
      u.name, 
      u.email,
      u.role
    FROM login_logs l
    JOIN users u ON l.user_id = u.id
    WHERE l.user_id = ?
    ORDER BY l.created_at DESC
  `, [user_id]);
  return rows;
}
