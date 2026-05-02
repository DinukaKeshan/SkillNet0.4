import express from "express";
import { getRoadmap } from "../controllers/skill.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * GET /api/roadmap/:studentId/:skill
 * Returns the saved roadmap for a student + skill from their skillProfiles.
 */
router.get("/:studentId/:skill", protect, getRoadmap);

export default router;
