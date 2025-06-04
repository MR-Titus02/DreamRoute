import pool from '../config/db.js';

export const getAllUsers = async (req, res) => {
  try {
    // Exclude sensitive fields like password_hash
    const [rows] = await pool.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );

    res.status(200).json({ users: rows });
  } catch (err) {
    res.status(500).json({
      error: 'Failed to fetch users',
      details: err.message,
    });
  }
};
