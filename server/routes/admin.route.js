import express from 'express';
import { changeUserRole } from '../controllers/admin.controller.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import adminOnly from '../middlewares/adminOnlyMiddleware.js';

const router = express.Router();

// Admin route to change user role
router.put('/change/:id', verifyToken, adminOnly, changeUserRole);

export default router;
