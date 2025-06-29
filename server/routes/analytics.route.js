import express from "express";
import db from "../config/db.js";

const router = express.Router();

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    // Get user's roadmap (assuming one roadmap per user)
    const [roadmaps] = await db.query(
      `SELECT id, career FROM roadmaps WHERE user_id = ? LIMIT 1`,
      [userId]
    );
    if (roadmaps.length === 0) {
      return res.json({
        roadmap: { career: "No Career roadmap found", steps: [] },
        coursesViewed: 0,
        feedbackCount: 0,
        averageRating: null,
        lastActive: null,
      });
    }
    const roadmap = roadmaps[0];

    // Get roadmap steps ordered by step_id ascending
    const [steps] = await db.query(
      `SELECT step_id, label, description, estimated_time, course_id 
       FROM roadmap_steps 
       WHERE roadmap_id = ? 
       ORDER BY step_id ASC`,
      [roadmap.id]
    );

    // Count how many distinct courses user has viewed
    const [[coursesViewedRow]] = await db.query(
      `SELECT COUNT(DISTINCT course_id) as count FROM user_courses_viewed WHERE user_id = ?`,
      [userId]
    );
    const coursesViewed = coursesViewedRow.count || 0;

    // Count feedbacks given by user
    const [[feedbackCountRow]] = await db.query(
      `SELECT COUNT(*) as count, AVG(rating) as averageRating FROM feedbacks WHERE user_id = ?`,
      [userId]
    );
    const feedbackCount = feedbackCountRow.count || 0;
    const averageRating = feedbackCountRow.averageRating
      ? parseFloat(feedbackCountRow.averageRating).toFixed(2)
      : null;

    // Get last active time from user_activity table
    const [[lastActiveRow]] = await db.query(
      `SELECT last_active FROM user_activity WHERE user_id = ?`,
      [userId]
    );
    const lastActive = lastActiveRow ? lastActiveRow.last_active : null;

    res.json({
      roadmap: {
        career: roadmap.career,
        steps,
      },
      coursesViewed,
      feedbackCount,
      averageRating,
      lastActive,
    });
  } catch (err) {
    console.error("Error fetching analytics:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
