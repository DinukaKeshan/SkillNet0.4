// app.js - Make sure this is your setup
import express from "express";
import cors from "cors";
import skillRoutes from "./routes/skill.routes.js";
import quizRoutes from "./routes/quiz.routes.js";
import roadmapRoutes from "./routes/roadmap.routes.js";
import { protect } from "./middleware/auth.middleware.js";

const app = express();

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));
app.use(express.json());

// Returns the current user's SVE profile (auth middleware auto-creates the user)
app.get("/api/auth/me", protect, (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  });
});

// ✅ IMPORTANT: Specific routes MUST come before general ones
app.use("/api/skills",  skillRoutes);
app.use("/api/quiz",    quizRoutes);
app.use("/api/roadmap", protect, roadmapRoutes);

export default app;