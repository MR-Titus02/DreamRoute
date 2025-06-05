// routes/userRoutes.js
import express from 'express';
import { getAllUsers, getUserById } from '../controllers/user.controller.js';

const router = express.Router();

// GET /api/users
router.get('/', getAllUsers);

// GET /api/users/:id
router.get('/:id', getUserById);

export default router;
