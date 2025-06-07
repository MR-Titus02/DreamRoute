import * as Course from '../models/courseModel.js';

export const createCourse = async (req, res) => {
  const { title, description } = req.body;
  const institution_id = req.user.institution_id;

  try {
    const id = await Course.createCourse(title, description, institution_id);
    res.status(201).json({ message: 'Course created', courseId: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllCourses = async (req, res) => {
  const courses = await Course.getAllCourses();
  res.json(courses);
};

export const getCourse = async (req, res) => {
  const course = await Course.getCourseById(req.params.id);
  if (!course) return res.status(404).json({ error: 'Not found' });
  res.json(course);
};

export const updateCourse = async (req, res) => {
  const { title, description } = req.body;
  await Course.updateCourse(req.params.id, title, description);
  res.json({ message: 'Course updated' });
};

export const deleteCourse = async (req, res) => {
  await Course.deleteCourse(req.params.id);
  res.json({ message: 'Course deleted' });
};
