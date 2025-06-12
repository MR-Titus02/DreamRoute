import * as CourseModel from '../models/courseModel.js';
import { getCourseInstitutionId } from '../models/courseModel.js';


// Here if an institution creates a Course it will be linked to the institution_id of the user 
// If an admin creates a Course it will be linked to the institution_id provided in the request body
export const createCourse = async (req, res) => {
  const { title, description, institution_id: bodyInstitutionId } = req.body;
  let institution_id;

  if (req.user.role === 'institution') {
    institution_id = req.user.institution_id;
  } else if (req.user.role === 'admin') {
    if (!bodyInstitutionId) {
      return res.status(400).json({ error: 'Admin must provide institution_id in request body' });
    }
    institution_id = bodyInstitutionId;
  } else {
    return res.status(403).json({ error: 'Only institutions or admins can create courses' });
  }

  try {
    const courseId = await CourseModel.createCourse(title, description, institution_id);
    res.status(201).json({ message: 'Course created successfully', courseId });
  } catch (err) {
    res.status(500).json({ error: 'Server error while creating course' });
  }
};

export const getAllCourses = async (req, res) => {
  try {
    const courses = await CourseModel.getAllCourses();
    res.json(courses);
  } catch (err) {
    console.error('Get All Courses Error:', err);
    res.status(500).json({ error: 'Server error while fetching courses' });
  }
};

export const getCourseById = async (req, res) => {
  const courseId = req.params.id;
  try {
    const course = await CourseModel.getCourseById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching course' });
  }
};

export const updateCourse = async (req, res) => {
  const courseId = req.params.id;
  const { title, description, duration, price } = req.body;

  try {
    const courseInstitutionId = await getCourseInstitutionId(courseId);

    if (req.user.role !== 'admin' && req.user.institution_id !== courseInstitutionId) {
      return res.status(403).json({ error: 'Not authorized to update this course' });
    }

    await CourseModel.updateCourse(courseId, title, description, duration, price);
    res.json({ message: 'Course updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error while updating course' });
  }
};

export const deleteCourse = async (req, res) => {
  const courseId = req.params.id;

  try {
    const courseInstitutionId = await getCourseInstitutionId(courseId);

    if (req.user.role !== 'admin' && req.user.institution_id !== courseInstitutionId) {
      return res.status(403).json({ error: 'Not authorized to delete this course' });
    }

    await CourseModel.deleteCourse(courseId);
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error while deleting course' });
  }
};
