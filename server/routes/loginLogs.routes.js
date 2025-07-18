import express from "express";
import {
  logLoginAttempt,
  getAllLoginLogs,
  getLoginLogsByUser,
} from "../controllers/loginLogs.controller.js";

import { verifyToken, checkRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Log a login attempt
router.post("/", logLoginAttempt);

// Admin route to get all logs
router.get("/", verifyToken, checkRole("admin"), getAllLoginLogs);

// Get login logs for a specific user
router.get("/:id", verifyToken, getLoginLogsByUser);

export default router;
