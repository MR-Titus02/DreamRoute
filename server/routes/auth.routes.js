// routes/authRoutes.js
import express from 'express';
import { body } from 'express-validator';
import { register, login } from '../controllers/auth.controller.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const router = express.Router();

router.post(
    '/register',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Enter a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('role').isIn(['student', 'institution', 'admin']).withMessage('Invalid role'),
        validateRequest
      ],
    register
    );

router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').notEmpty().withMessage('Password is required'),
        validateRequest
    ],
    login);

export default router;
