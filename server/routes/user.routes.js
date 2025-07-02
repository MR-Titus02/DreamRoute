// routes/userRoutes.js
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
// import { logUserAction } from '../utils/logger.js';

const router = express.Router();

// GET All users /api/users
router.get('/',  getAllUsers);

// GET /api/users/:id
router.get('/:id', verifyToken, roleMiddleware, getUserById);
//// PUT /api/users/:id
router.put('/:id', verifyToken, roleMiddleware, updateUser);
//delete /api/users/:id
router.delete('/:id', verifyToken, roleMiddleware, deleteUser);

router.get('/me',verifyToken,roleMiddleware, completeProfile);

router.put('/complete-profile', verifyToken, roleMiddleware, completeProfile);

export default router;





