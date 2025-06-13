// controllers/userController.js
import * as UserModel from '../models/userModel.js';
import pool from '../config/db.js';
import { logErrorToFile } from '../utils/logger.js';
//GetAllUsers
export async function getAllUsers(req, res) {
  try {
    const users = await UserModel.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    logErrorToFile(`Get All users error for ${req.body.email}: ${error.message}`);
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
    logErrorToFile(`Get user id error for ${req.body.email}: ${error.message}`);
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
    logErrorToFile(`update user error for ${req.body.email}: ${err.message}`);
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
    logErrorToFile(`delete user error for ${req.body.email}: ${err.message}`);
    res.status(500).json({ error: 'Failed to delete user', details: err.message });
  }
}