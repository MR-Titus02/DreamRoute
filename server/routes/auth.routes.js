// routes/authRoutes.js
import express from 'express';
import { body } from 'express-validator';
import { register, login } from '../controllers/auth.controller.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { refreshAccessToken, logout } from '../controllers/auth.controller.js';
import roleMiddleware from '../middlewares/roleMiddlware.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { loginLimiter } from '../middlewares/rateLimiter.js'; 
import { logUserAction } from '../utils/logger.js';
import { validateRegister, validateLogin } from '../middlewares/validateInputs.js';
import { forgotPassword, resetPassword } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', validateRegister, validateRequest, register);
router.post('/login', validateLogin, validateRequest,loginLimiter, login);

router.post('/refresh', verifyToken, refreshAccessToken);
router.post('/logout',roleMiddleware, logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
