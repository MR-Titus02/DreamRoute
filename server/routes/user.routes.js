import express from 'express';
import pool from '../config/db.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { checkRole } from '../middlewares/authMiddleware.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users', details: err.message });
  }
});

// ✅ Get a single user by ID
router.get('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  // Allow if user is admin or requesting their own data
  if (req.user.userId !== parseInt(id) && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const [rows] = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user', details: err.message });
  }
});

const SALT_ROUNDS = 10;

router.put('/:id', verifyToken, async (req, res) => {
  const userId = parseInt(req.params.id);
  const { name, email, password } = req.body;

  try {
    // Check if user exists
    const [existing] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    let hashedPassword = existing[0].password_hash;
    if (password) {
      hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    }

    await pool.query(
      'UPDATE users SET name = ?, email = ?, password_hash = ? WHERE id = ?',
      [name || existing[0].name, email || existing[0].email, hashedPassword, userId]
    );

    res.json({ message: 'User profile updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', verifyToken, checkRole('admin'), async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const [existing] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    await pool.query('DELETE FROM users WHERE id = ?', [userId]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
