import pool from '../config/db.js';

export const changeUserRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  try {
    const [user] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    if (!user.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user role
    await pool.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);

    // If role changed to institution and not already in institutions table
    if (role === 'institution') {
      const [institution] = await pool.query('SELECT * FROM institutions WHERE user_id = ?', [id]);
      if (!institution.length) {
        await pool.query('INSERT INTO institutions (user_id) VALUES (?)', [id]);
      }
    }

    res.status(200).json({ message: 'User role updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while updating user role' });
  }
};
