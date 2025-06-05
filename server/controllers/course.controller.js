import * as CourseModel from '../models/courseModel.js';

export async function getAllCourses(req, res) {
  try {
    const courses = await CourseModel.getAllCourses();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

export async function getCourseById(req, res) {
  try {
    const course = await CourseModel.getCourseById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}
