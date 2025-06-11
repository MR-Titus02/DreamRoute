// controllers/userController.js
import * as UserModel from '../models/userModel.js';
import pool from '../config/db.js';
//GetAllUsers
export async function getAllUsers(req, res) {
  try {
    const users = await UserModel.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
// GET user by ID
export async function getUserById(req, res) {
  try {
    const user = await UserModel.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Error in getUserById:', error);
    res.status(500).json({ message: 'Server error' });
  }
}


// updateUser
// PUT /api/users/:id
export async function updateUser(req, res) {
  const userId = parseInt(req.params.id);
  const { name, email } = req.body;

  try {
    await pool.query(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, userId]
    );
    res.json({ message: 'User updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user', details: err.message });
  }
}

// DELETE /api/users/:id
export async function deleteUser(req, res) {
  const userId = parseInt(req.params.id);

  try {
    const [result] = await pool.query('DELETE FROM users WHERE id = ?', [userId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user', details: err.message });
  }
}