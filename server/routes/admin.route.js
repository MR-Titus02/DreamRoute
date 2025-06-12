import express from 'express';
import { changeUserRole } from '../controllers/admin.controller.js';
import { checkRole, verifyToken } from '../middlewares/authMiddleware.js';
import { logUserAction } from '../utils/logger.js';

const router = express.Router();

// Admin route to change user role
router.put('/change/:id', verifyToken, checkRole('admin'), changeUserRole);

export default router;
