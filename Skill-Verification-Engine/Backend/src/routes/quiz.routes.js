import express from "express";
import {
  startQuiz,
  nextQuestion,
  submitQuiz,
  getQuizResult,
  getQuizHistory,
  getAllQuizHistory,
  getQuizAttemptDetail,
} from "../controllers/quiz.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Core quiz flow
router.post("/start",  protect, startQuiz);
router.post("/next",   protect, nextQuestion);
router.post("/submit", protect, submitQuiz);

// Result fetch (fallback for direct URL access)
router.get("/:quizId/result", protect, getQuizResult);

// All quiz history for current user (must be before parameterized routes)
router.get("/history/all", protect, getAllQuizHistory);

// Single attempt detail (must be before :studentId/:skill to avoid conflict)
router.get("/history/:attemptId", protect, getQuizAttemptDetail);

// Quiz history per student + skill
router.get("/history/:studentId/:skill", protect, getQuizHistory);

export default router;
