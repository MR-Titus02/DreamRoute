import * as Profile from '../models/userProfileModel.js';
import logger from '../utils/logger.js';
import { logUserAction } from '../utils/logger.js';

export async function createProfile(req, res) {
  try {
    const user_id = req.user.userId;
    const result = await Profile.createUserProfile({ user_id, ...req.body });
    res.status(201).json({ message: 'Profile created', id: result.id });
    await logUserAction(user_id, 'Created profile', JSON.stringify(req.body));

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
    logger.error(`CreateProfile error for ${req.body.email}: ${err.message}`);
    await logUserAction(req.user.userId, 'Create profile failed', JSON.stringify(req.body));
  }
}

export async function getProfile(req, res) {
  try {
    const user_id = req.user.userId;
    const profile = await Profile.getUserProfile(user_id);
    await logUserAction(user_id, 'Got User profile ', JSON.stringify(req.body));
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
    logger.error(`GetProfile error for ${req.body.email}: ${err.message}`);
    await logUserAction(req.user.userId, 'Get profile failed', JSON.stringify(req.body));
  }
}

export async function updateProfile(req, res) {
  try {
    const user_id = req.user.userId;
    await Profile.updateUserProfile(user_id, req.body);
    await logUserAction(user_id, 'Updated profile', JSON.stringify(req.body));
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
    logger.error(`UpdateProfile error for ${req.body.email}: ${err.message}`);
    await logUserAction(req.user.userId, 'Update profile failed', JSON.stringify(req.body));
  }
}

export async function deleteProfile(req, res) {
  try {
    const user_id = req.user.userId;
    await Profile.deleteUserProfile(user_id);
    await logUserAction(user_id, 'Deleted profile', JSON.stringify(req.body));
    res.json({ message: 'Profile deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
    logger.error(`DeleteProfile error for ${req.body.email}: ${err.message}`);
    await logUserAction(req.user.userId, 'Delete profile failed', JSON.stringify(req.body));
  }
}
