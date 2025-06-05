// routes/courseRoutes.js
import express from 'express';
import { getAllCourses, getCourseById } from '../controllers/course.controller.js';

const router = express.Router();

router.get('/', getAllCourses);       // GET /api/courses
router.get('/:id', getCourseById);    // GET /api/courses/:id

export default router;
