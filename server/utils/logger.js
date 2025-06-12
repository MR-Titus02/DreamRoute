import pool from '../config/db.js';

export async function logUserAction(user_id, action, details = '') {
  try {
    await pool.query(
      'INSERT INTO user_actions (user_id, action, details) VALUES (?, ?, ?)',
      [user_id, action, details]
    );
  } catch (err) {
    console.error('Error logging user action:', err);
  }
}
