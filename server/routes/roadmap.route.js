import express from "express";
import { generateRoadmap } from "../controllers/roadmap.controller.js";

const router = express.Router();
router.post("/", generateRoadmap);

export default router;