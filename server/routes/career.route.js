import express from "express";
import {
  generateCareer,
  getCareerRoadmap,
} from "../controllers/career.controller.js";

const router = express.Router();

// Generate and save roadmap to DB
router.post("/generate", generateCareer); // POST /api/career/generate

// Fetch saved roadmap
router.get("/:userId", getCareerRoadmap); // GET /api/career/:userId

export default router;
