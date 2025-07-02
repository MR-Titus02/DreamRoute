import * as CourseModel from '../models/courseModel.js';
import { getCourseInstitutionId } from '../models/courseModel.js';
import { logUserAction } from '../utils/logger.js';

export const createCourse = async (req, res) => {
  const {
    title,
    description,
    institution_id: bodyInstitutionId,
    duration,
    price,
    status: frontendStatus,
  } = req.body;

  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized. User not found in request." });
    }

    const role = req.user.role?.toLowerCase(); // Normalize role
    let institution_id;
    let status = frontendStatus || 'pending';

    // Validate required fields
    if (!title || !description || !duration || !price) {
      return res.status(400).json({ error: "Missing required course fields." });
    }

    // Role-based handling
    if (role === 'institution') {
      if (!req.user.institution_id) {
        return res.status(400).json({ error: "Institution user missing institution_id.", details: req.user });
      }
      institution_id = req.user.institution_id;
    } else if (role === 'admin') {
      if (!bodyInstitutionId) {
        return res.status(400).json({ error: "Admin must provide institution_id in request body." });
      }
      institution_id = bodyInstitutionId;

      // Only allow specific statuses from admin
      if (!["approved", "pending"].includes(status)) {
        status = 'approved';
      }
    } else {
      console.error("Invalid role or access attempt:", req.user);
      return res.status(403).json({ error: "Only institutions or admins can create courses." });
    }

    // Create course
    const courseId = await CourseModel.createCourse(
      title,
      description,
      institution_id,
      duration,
      price,
      status
    );

    await logUserAction(req.user.userId, 'Created course', JSON.stringify(req.body));

    return res.status(201).json({
      message: "Course created successfully",
      courseId,
    });

  } catch (err) {
    console.error("Server error in createCourse:", err);
    await logUserAction(req.user?.userId || "unknown", 'Create course failed', JSON.stringify(req.body));
    return res.status(500).json({
      error: "Server error while creating course",
    });
  }
};


export const getAllCourses = async (req, res) => {
  try {
    const courses = await CourseModel.getAllCourses();
    res.json(courses);
    await logUserAction(req.user.userId, 'Fetched all courses', JSON.stringify(req.body));
  } catch (err) {
    console.error('Get All Courses Error:', err);
    res.status(500).json({ error: 'Server error while fetching courses', err });
    await logUserAction(req.user.userId, 'Get all courses failed', JSON.stringify(req.body));
  }
};

export const getCourseById = async (req, res) => {
  const courseId = req.params.id;
  try {
    const course = await CourseModel.getCourseById(courseId);
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
    await logUserAction(req.user.userId, 'Fetched course by ID', JSON.stringify(req.body));
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching course' });
    await logUserAction(req.user.userId, 'Get course by ID failed', JSON.stringify(req.body));
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
    await logUserAction(req.user.userId, 'Updated course', JSON.stringify(req.body));
  } catch (err) {
    res.status(500).json({ error: 'Server error while updating course' });
    await logUserAction(req.user.userId, 'Update course failed', JSON.stringify(req.body));
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
    await logUserAction(req.user.userId, 'Deleted course', JSON.stringify(req.body));
  } catch (err) {
    res.status(500).json({ error: 'Server error while deleting course' });
    await logUserAction(req.user.userId, 'Delete course failed', JSON.stringify(req.body));
  }
};


export const updateCourseStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const courseInstitutionId = await getCourseInstitutionId(id);

    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: "Only admin can change status" });
    }
    console.log("Updating course ID:", id, "to status:", status);
    await CourseModel.updateCourseStatus(id, status);
    res.json({ message: `Course ${status} successfully` });
  } catch (err) {
    console.error("Update course status error:", err);
    res.status(500).json({ error: "Server error while updating status" });
  }
};