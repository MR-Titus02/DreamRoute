import pool from '../config/db.js';

export const createCourse = async (title, description, institution_id) => {
  const [result] = await pool.query(
    'INSERT INTO courses (title, description, institution_id) VALUES (?, ?, ?)',
    [title, description, institution_id]
  );
  return result.insertId;
};

export const getAllCourses = async () => {
  const [rows] = await pool.query('SELECT * FROM courses');
  return rows;
};

export const getCourseById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM courses WHERE id = ?', [id]);
  return rows[0];
};

export const updateCourse = async (id, title, description, duration, price) => {
  await pool.query('UPDATE courses SET title = ?, description = ?, duration = ?, price = ? WHERE id = ?', [title, description, duration, price, id]);
};

export const deleteCourse = async (id) => {
  await pool.query('DELETE FROM courses WHERE id = ?', [id]);
};

export const getCourseInstitutionId = async (id) => {
  const [rows] = await pool.query('SELECT institution_id FROM courses WHERE id = ?', [id]);
  return rows[0]?.institution_id;
};
