// controllers/userController.js
import pool from '../config/db.js';

// Get all users (excluding passwords)
export async function getAllUsers(req, res) {
  try {
    const [users] = await pool.query(
      'SELECT id, email, role, name, created_at FROM users'
    );
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get user by ID
export async function getUserById(req, res) {
  const userId = req.params.id;
  try {
    const [rows] = await pool.query(
      'SELECT id, email, role, name, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching user by ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
}
