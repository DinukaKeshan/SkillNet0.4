import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
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
    questions: [
      {
        question: String,
        options: [String],
        // Legacy field — index-based correct answer (kept for backward compat)
        correctIndex: Number,
        // New field — letter-based correct answer (A/B/C/D)
        correct_answer: { type: String, enum: ["A", "B", "C", "D"], default: "A" },
        userAnswer: {
          type: Number,
          min: [0, 'User answer must be between 0 and 3'],
          max: [3, 'User answer must be between 0 and 3']
        },
        // New: selected letter answer for batch quiz flow
        selected_answer: { type: String, default: null },
        // New: difficulty and topic tags from the batch prompt
        difficulty: {
          type: String,
          enum: ["easy", "medium", "hard"],
          default: "medium"
        },
        topic: { type: String, default: "" }
      }
    ],
    score:     { type: Number, default: 0 },
    completed: { type: Boolean, default: false },

    // New fields — added for ML feature integration (optional, backward-compatible)
    time_taken_sec: { type: Number, default: 0 },
    score_pct:      { type: Number, default: 0 },
    skill_level:    { type: String, default: "" },
    confidence:     { type: Number, default: 0 },
    verified:       { type: Boolean, default: false },
    attempt_number: { type: Number, default: 1 },

    // Track current question index for batch quiz flow
    current_index:  { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["in_progress", "completed"],
      default: "in_progress"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);