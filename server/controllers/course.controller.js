import pool from '../config/db.js'; 
import logger from '../logger.js'; // If you use winston

export const getAllCourses = async (req, res) => {
  try {
    const [courses] = await pool.query('SELECT * FROM courses');
    res.json(courses);
  } catch (err) {
    logger.error(`Error fetching courses: ${err.message}`);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};
