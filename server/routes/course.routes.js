import express from 'express';
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse
} from '../controllers/course.controller.js';

import { checkInstitutionOrAdmin, verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public Routes
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Protected Routes
router.post('/', verifyToken, createCourse); 
router.put('/:id', verifyToken, updateCourse); 
router.delete('/:id', verifyToken, deleteCourse); 

export default router;
