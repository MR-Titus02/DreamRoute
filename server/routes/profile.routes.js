import express from 'express';
import {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile
} from '../controllers/profile.controller.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, createProfile);
router.get('/', verifyToken, getProfile);
router.put('/', verifyToken, updateProfile);
router.delete('/', verifyToken, deleteProfile);

export default router;
