// routes/courseRoutes.js
import express from 'express';
import { createCourse, getAllCourses, getCourse, updateCourse, deleteCourse } from '../controllers/course.controller.js';
import { checkInstitutionOrAdmin, verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getAllCourses); // public
router.get('/:id', getCourse); // public

router.post('/', verifyToken, createCourse); // institution or admin
router.put('/:id', verifyToken, checkInstitutionOrAdmin, updateCourse);
router.delete('/:id', verifyToken, checkInstitutionOrAdmin, deleteCourse);

export default router;
