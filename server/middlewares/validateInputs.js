import { body, param, query } from 'express-validator';

export const validateRegister = [
  body('email').isEmail().withMessage('Enter a valid email').trim().escape(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters').escape(),
  body('role').isIn(['student', 'institution', 'admin']).withMessage('Invalid role').escape(),
  body('name').notEmpty().withMessage('Name is required').trim().escape(),
];

export const validateLogin = [
  body('email').isEmail().withMessage('Enter a valid email').trim().escape(),
  body('password').notEmpty().withMessage('Password is required').escape(),
];

export const validateUserId = [
  param('id').isInt().withMessage('User ID must be an integer').toInt(),
];

export const validateQueryParams = [
  query('page').optional().isInt().withMessage('Page must be an integer').toInt(),
  query('limit').optional().isInt().withMessage('Limit must be an integer').toInt(),
];