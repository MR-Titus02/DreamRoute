// controllers/progressController.js
import db from "../config/db.js";

export const getProgress = async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT step_id, status FROM roadmap_progress WHERE user_id = ?",
      [userId]
    );
    const progressMap = {};
    rows.forEach(row => {
      progressMap[row.step_id] = row.status;
    });
    res.json(progressMap);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch progress." });
  }
};

export const updateProgress = async (req, res) => {
  const { userId, stepId, status } = req.body;
  try {
    await db.query(
      `INSERT INTO roadmap_progress (user_id, step_id, status)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE status = ?`,
      [userId, stepId, status, status]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to update progress." });
  }
};
