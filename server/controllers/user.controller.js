// controllers/userController.js
import * as UserModel from '../models/userModel.js';
import pool from '../config/db.js';
import logger, { logUserAction } from '../utils/logger.js';
//GetAllUsers
export async function getAllUsers(req, res) {
  try {
    const users = await UserModel.getAllUsers();
    res.json(users);
    await logUserAction(req.user.userId, 'Fetched all users', JSON.stringify(req.body));
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    await logUserAction(req.user.userId, 'Get all users failed', JSON.stringify(req.body));
    res.status(500).json({ message: 'Server error' });
  }
}

// GET user by ID
export async function getUserById(req, res) {
  try {
    const user = await UserModel.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await logUserAction(req.user.userId, 'Fetched user by ID', JSON.stringify(req.body));
    res.json(user);
  } catch (error) {
    console.error('Error in getUserById:', error);
    res.status(500).json({ message: 'Server error' });
    await logUserAction(req.user.userId, 'Get user by ID failed', JSON.stringify(req.body));
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
    await logUserAction(req.user.userId, 'Updated user', JSON.stringify(req.body));
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user', details: err.message });
    await logUserAction(req.user.userId, 'Update user failed', JSON.stringify(req.body));
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

import { uploadImage } from '../utils/uploadToCloudinary.js';

export const uploadProfileImage = async (req, res) => {
  try {
    const localPath = req.file.path;
    const imageUrl = await uploadImage(localPath);
    res.status(200).json({ imageUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const completeProfile = async (req, res) => {
  const userId = req.user.userId;

  await pool.query("UPDATE users SET isProfileComplete = true WHERE id = ?", [userId]);

  res.json({ message: "Profile marked as complete" });
};


export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user?.userId || req.user?.id; // Handle both JWT and Passport sessions
    console.log("Session user:", req.user);
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const [rows] = await pool.query("SELECT id, name, email, role FROM users WHERE id = ?", [userId]);

    if (rows.length === 0) return res.status(404).json({ message: "User not found" });

    res.json(rows[0]);
  } catch (error) {
    console.error("Error getting current user:", error);
    res.status(500).json({ message: "Server error" });
  }
};