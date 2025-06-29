import express from "express";
import { generateRoadmap, getSavedRoadmap, getAllRoadmaps } from "../controllers/roadmap.controller.js";

const router = express.Router();
router.post("/", generateRoadmap);

router.get("/", getAllRoadmaps); 
router.get("/:userId", getSavedRoadmap); 


export default router;