import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddlware.js';
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    completeProfile,
    getCurrentUser
} from '../controllers/user.controller.js';
import { ensureAuthenticated } from '../middlewares/SessionAuth.js';

const router = express.Router();

// GET All users /api/users
router.get('/', getAllUsers);

// GET /api/users/:id
router.get('/:id', verifyToken, roleMiddleware, getUserById);

// PUT /api/users/:id
router.put('/:id', verifyToken, roleMiddleware, updateUser);

// DELETE /api/users/:id
router.delete('/:id', verifyToken, roleMiddleware, deleteUser);

// GET current logged-in user info
router.get('/me', ensureAuthenticated ,getCurrentUser);

// PUT to mark profile complete
// router.put('/complete-profile', verifyToken, completeProfile);

export default router;
