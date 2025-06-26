import express from "express";
import {
  logLoginAttempt,
  getAllLoginLogs,
  getUserLoginLogs,
} from "../controllers/loginLogs.controller.js";
import { verifyToken, checkRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Log a login attempt (used inside login controller ideally)
router.post("/", logLoginAttempt);

// Get all logs (admin only)
router.get("/", verifyToken, checkRole("admin"), getAllLoginLogs);

// Get logs by user
router.get("/:id", verifyToken, getUserLoginLogs);

export default router;


