import express from 'express';
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  updateCourseStatus
} from '../controllers/course.controller.js';

import { verifyToken, checkRole } from '../middlewares/authMiddleware.js';
import roleMiddleware from '../middlewares/roleMiddlware.js';
// import { logUserAction } from '../utils/logger.js';
const router = express.Router();

// Public Routes
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Protected Routes
router.post('/', verifyToken, createCourse); 
router.put('/:id', verifyToken, updateCourse); 
router.put('/:id/status', verifyToken, updateCourseStatus);
router.delete('/:id', verifyToken ,deleteCourse); 

export default router;
