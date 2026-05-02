import mongoose from "mongoose";

const skillProfileSchema = new mongoose.Schema(
  {
    skill_name:        { type: String, required: true },
    verified:          { type: Boolean, default: false },
    verified_level:    { type: String, default: "" },        // Beginner / Intermediate / Advanced
    last_quiz_score:   { type: Number, default: 0 },         // score percentage 0–100
    last_attempt_date: { type: Date },
    roadmap:           { type: mongoose.Schema.Types.Mixed, default: null }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String
    },

    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local"
    },

    // Mixed type keeps backward compat with existing String entries
    skills: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
    },

    // New: rich per-skill profile with ML predictions and roadmap
    skillProfiles: {
      type: [skillProfileSchema],
      default: []
    },

    // Kept for backward compatibility
    verifiedSkills: [
      {
        skill:      String,
        badge:      String,
        verifiedAt: Date,
        score:      Number,
        total:      Number,
        percentage: Number
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
