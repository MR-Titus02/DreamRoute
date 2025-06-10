import pool from '../config/db.js';

export async function getAllFeedbacksFromDb() {
  const [rows] = await pool.query('SELECT * FROM feedbacks');
  return rows;
}

export async function getFeedbackByIdFromDb(id) {
  const [rows] = await pool.query('SELECT * FROM feedbacks WHERE id = ?', [id]);
  return rows[0];
}

export async function createFeedbackInDb({ user_id, course_id, institution_id, message, rating }) {
  const [result] = await pool.query(
    'INSERT INTO feedbacks (user_id, course_id, institution_id, message, rating) VALUES (?, ?, ?, ?, ?)',
    [user_id, course_id || null, institution_id || null, message, rating]
  );
  return result.insertId;
}

export async function updateFeedbackInDb(id, { message, rating }) {
  await pool.query(
    'UPDATE feedbacks SET message = ?, rating = ? WHERE id = ?',
    [message, rating, id]
  );
}

export async function deleteFeedbackFromDb(id) {
  await pool.query('DELETE FROM feedbacks WHERE id = ?', [id]);
}