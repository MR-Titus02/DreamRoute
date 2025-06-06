// routes/userRoutes.js
import express from 'express';
import { getAllUsers, getUserById } from '../controllers/user.controller.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddlware.js';



const router = express.Router();

// GET /api/users
router.get('/', getAllUsers);

// GET /api/users/:id
// router.get('/:id', getUserById);

router.get('/:id', verifyToken, roleMiddleware, getUserById);

export default router;





