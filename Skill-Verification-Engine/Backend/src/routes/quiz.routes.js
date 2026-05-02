import express from "express";
import {
  startQuiz,
  nextQuestion,
  submitQuiz,
  getQuizResult,
  getQuizHistory,
  getAllQuizHistory,
} from "../controllers/quiz.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Core quiz flow
router.post("/start",  protect, startQuiz);
router.post("/next",   protect, nextQuestion);
router.post("/submit", protect, submitQuiz);

// Result fetch (fallback for direct URL access)
router.get("/:quizId/result", protect, getQuizResult);

// All quiz history for current user (must be before :studentId/:skill)
router.get("/history/all", protect, getAllQuizHistory);

// Quiz history per student + skill
router.get("/history/:studentId/:skill", protect, getQuizHistory);

export default router;
