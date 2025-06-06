// routes/userRoutes.js
import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddlware.js';
import adminOnly from '../middlewares/adminOnlyMiddleware.js';
import {
    getAllUsers,
     getUserById,
     updateUser,
    deleteUser,
} from '../controllers/user.controller.js';

const router = express.Router();

// GET All users /api/users
router.get('/', verifyToken, roleMiddleware, getAllUsers);

// GET /api/users/:id
router.get('/:id', verifyToken, roleMiddleware, getUserById);
//// PUT /api/users/:id
router.put('/:id', verifyToken, roleMiddleware, updateUser);
//delete /api/users/:id
router.delete('/:id', verifyToken, adminOnly, deleteUser);

export default router;





