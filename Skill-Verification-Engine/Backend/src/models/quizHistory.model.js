import mongoose from "mongoose";

/**
 * QuizHistory — tracks SHA-256 hashes of questions asked per student per skill.
 * Used to prevent duplicate questions across quiz attempts.
 * Collection: quiz_history
 */
const quizHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    skill: {
      type: String,
      required: true
    },
    // SHA-256 hashes of question texts that have already been shown to this student
    asked_question_hashes: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

// Compound unique index — one document per (student, skill) pair
quizHistorySchema.index({ user: 1, skill: 1 }, { unique: true });

export default mongoose.model("QuizHistory", quizHistorySchema, "quiz_history");
