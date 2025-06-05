// controllers/courseController.js
import pool from '../config/db.js';

// Get all courses
export async function getAllCourses(req, res) {
  try {
    const [courses] = await pool.query('SELECT * FROM courses');
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get course by ID
export async function getCourseById(req, res) {
  const courseId = req.params.id;

  try {
    const [rows] = await pool.query('SELECT * FROM courses WHERE id = ?', [courseId]);
    if (rows.length === 0) return res.status(404).json({ message: 'Course not found' });

    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
