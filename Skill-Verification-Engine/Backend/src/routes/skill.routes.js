// routes/skill.routes.js
import express from "express";
import {
  addSkill,
  getSkills,
  claimBadge,
  getStudentSkills,
  syncAddSkill,
  syncRemoveSkill,
  deleteSkill,
} from "../controllers/skill.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// ✅ Specific routes BEFORE general ones
router.post("/claim-badge",           protect, claimBadge);
router.get("/student/:id/skills",     protect, getStudentSkills);

// Sync routes (called by SkillNet dashboard fire-and-forget)
router.post("/sync-add",    protect, syncAddSkill);
router.post("/sync-remove", protect, syncRemoveSkill);

// General CRUD
router.post("/",    protect, addSkill);
router.get("/",     protect, getSkills);
router.delete("/",  protect, deleteSkill);

export default router;