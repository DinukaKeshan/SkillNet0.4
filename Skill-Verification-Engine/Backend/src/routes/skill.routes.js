// routes/skill.routes.js
import express from "express";
import {
  addSkill,
  getSkills,
  claimBadge,
  getStudentSkills,
} from "../controllers/skill.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// ✅ Specific routes BEFORE general ones
router.post("/claim-badge",           protect, claimBadge);
router.get("/student/:id/skills",     protect, getStudentSkills);

// General CRUD
router.post("/",  protect, addSkill);
router.get("/",   protect, getSkills);

export default router;