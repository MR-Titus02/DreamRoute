import express from "express";
import { generateCareer } from "../controllers/career.controller.js";

const router = express.Router();

router.post("/", generateCareer); // POST /api/career

export default router;