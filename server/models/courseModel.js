import pool from '../config/db.js';

export async function getAllCourses() {
  const [rows] = await pool.query('SELECT * FROM courses');
  return rows;
}

export async function getCourseById(id) {
  const [rows] = await pool.query('SELECT * FROM courses WHERE id = ?', [id]);
  return rows[0];
}
