import db from '../config/db.js';

export const createFeedback = async (userId, message, rating) => {
  const [result] = await db.query(
    'INSERT INTO feedbacks (user_id, message, rating) VALUES (?, ?, ?)',
    [userId, message, rating]
  );
  return { id: result.insertId, user_id: userId, message, rating };
};

export const getAllFeedbacks = async () => {
  const [rows] = await db.query(
    'SELECT f.*, u.name AS user_name FROM feedbacks f JOIN users u ON f.user_id = u.id ORDER BY f.created_at DESC'
  );
  return rows;
};

export const getFeedbackById = async (id) => {
  const [rows] = await db.query('SELECT * FROM feedbacks WHERE id = ?', [id]);
  return rows[0];
};

export const updateFeedback = async (id, message, rating) => {
  await db.query(
    'UPDATE feedbacks SET message = ?, rating = ? WHERE id = ?',
    [message, rating, id]
  );
};

export const deleteFeedback = async (id) => {
  await db.query('DELETE FROM feedbacks WHERE id = ?', [id]);
};
