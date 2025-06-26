import pool from "../config/db.js";

// Create a login log
export async function createLoginLog({ user_id, ip_address, user_agent, status }) {
  const [result] = await pool.query(
    `INSERT INTO login_logs (user_id, ip_address, user_agent, status) VALUES (?, ?, ?, ?)`,
    [user_id, ip_address, user_agent, status]
  );
  return result.insertId;
}

// Get all logs
export async function getAllLogs() {
  const [rows] = await pool.query("SELECT * FROM login_logs ORDER BY created_at DESC");
  return rows;
}

// Get logs by user ID
export async function getLogsByUser(user_id) {
  const [rows] = await pool.query("SELECT * FROM login_logs WHERE user_id = ? ORDER BY created_at DESC", [user_id]);
  return rows;
}
