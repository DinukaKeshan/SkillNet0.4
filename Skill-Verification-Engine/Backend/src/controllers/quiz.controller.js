import crypto from "crypto";
import Quiz from "../models/quiz.model.js";
import QuizHistory from "../models/quizHistory.model.js";
import User from "../models/user.model.js";
import { generateRagQuiz } from "../services/rag/rag.service.js";
import { predictSkillLevel } from "../services/mlService.js";
import { generateRoadmap, saveRoadmap } from "../services/roadmapService.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** SHA-256 hash of question text — used for duplicate detection */
function hashQuestion(text) {
  return crypto.createHash("sha256").update(text.trim()).digest("hex");
}

/** Convert letter answer (A/B/C/D) to 0-based index */
const LETTER_TO_INDEX = { A: 0, B: 1, C: 2, D: 3 };

/**
 * Builds a per-topic breakdown array from scored questions.
 * @returns {Array<{topic, correct, total}>}
 */
function buildTopicBreakdown(questions) {
  const topicMap = {};
  for (const q of questions) {
    const topic = q.topic || "General";
    if (!topicMap[topic]) topicMap[topic] = { correct: 0, total: 0 };
    topicMap[topic].total++;
    if (q._correct) topicMap[topic].correct++;
  }
  return Object.entries(topicMap).map(([topic, stats]) => ({
    topic,
    correct: stats.correct,
    total: stats.total,
  }));
}

// ─── START QUIZ ───────────────────────────────────────────────────────────────

/**
 * POST /api/quiz/start
 * Generates all 10 questions up-front, stores them, returns Q1.
 */
export const startQuiz = async (req, res) => {
  const { skill } = req.body;

  if (!skill) {
    return res.status(400).json({ success: false, error: "skill is required" });
  }

  try {
    // Load question hashes already asked for this student + skill
    const historyDoc = await QuizHistory.findOne({
      user: req.user._id || req.user.id,
      skill,
    });
    const existingHashes = historyDoc?.asked_question_hashes ?? [];

    // Batch-generate 10 questions (with retry up to 3×)
    let questions = await generateRagQuiz(skill, existingHashes);

    // Hash the generated questions and check for duplicates
    let questionHashes = questions.map(q => hashQuestion(q.question));
    const duplicateFound = questionHashes.some(h => existingHashes.includes(h));

    if (duplicateFound) {
      // One more attempt to get fresh questions
      console.log("🔄 Duplicate questions detected — retrying generation...");
      questions = await generateRagQuiz(skill, existingHashes);
      questionHashes = questions.map(q => hashQuestion(q.question));
    }

    // Count previous attempts for this student + skill
    const userId = req.user._id || req.user.id;
    const attemptCount = await Quiz.countDocuments({
      user: userId,
      skill,
    });
    const attemptNumber = attemptCount + 1;

    // Persist quiz document with all 10 questions
    const quiz = await Quiz.create({
      user: userId,
      skill,
      attempt_number: attemptNumber,
      current_index: 0,
      status: "in_progress",
      questions: questions.map(q => ({
        question:      q.question,
        options:       q.options,
        correct_answer: q.correct_answer,
        difficulty:    q.difficulty,
        topic:         q.topic,
        selected_answer: null,
        // Legacy correctIndex for backward compat
        correctIndex: LETTER_TO_INDEX[q.correct_answer] ?? 0,
        userAnswer: null,
      })),
    });

    // Update quiz history with new hashes (upsert)
    await QuizHistory.findOneAndUpdate(
      { user: userId, skill },
      { $addToSet: { asked_question_hashes: { $each: questionHashes } } },
      { upsert: true, new: true }
    );

    // Return Q1 to frontend
    const firstQ = quiz.questions[0];
    return res.status(200).json({
      success: true,
      data: {
        quizId: quiz._id,
        questionIndex: 0,
        totalQuestions: 10,
        question: {
          question:       firstQ.question,
          options:        firstQ.options,
          correct_answer: firstQ.correct_answer,   // included for immediate feedback UX
          difficulty:     firstQ.difficulty,
          topic:          firstQ.topic,
        },
      },
    });
  } catch (error) {
    console.error("startQuiz error:", error);
    return res.status(500).json({ success: false, error: error.message || "Server error" });
  }
};

// ─── NEXT QUESTION ────────────────────────────────────────────────────────────

/**
 * POST /api/quiz/next
 * Advances to the next pre-generated question — no Ollama call here.
 */
export const nextQuestion = async (req, res) => {
  const { quizId, questionIndex } = req.body;

  if (quizId === undefined || questionIndex === undefined) {
    return res.status(400).json({ success: false, error: "quizId and questionIndex are required" });
  }

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ success: false, error: "Quiz not found" });
    if (quiz.status === "completed") {
      return res.status(400).json({ success: false, error: "Quiz already completed" });
    }

    const idx = Number(questionIndex);
    if (idx < 0 || idx >= quiz.questions.length) {
      return res.status(400).json({ success: false, error: "Invalid question index" });
    }

    const q = quiz.questions[idx];
    return res.status(200).json({
      success: true,
      data: {
        quizId,
        questionIndex: idx,
        totalQuestions: quiz.questions.length,
        question: {
          question:       q.question,
          options:        q.options,
          correct_answer: q.correct_answer,   // included for immediate feedback UX
          difficulty:     q.difficulty,
          topic:          q.topic,
        },
        isComplete: false,
      },
    });
  } catch (error) {
    console.error("nextQuestion error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// ─── SUBMIT QUIZ ──────────────────────────────────────────────────────────────

/**
 * POST /api/quiz/submit
 * Scores the quiz, runs ML prediction, generates roadmap.
 *
 * Body: {
 *   quizId: string,
 *   answers: [{ questionIndex: number, selected: 'A'|'B'|'C'|'D' }],
 *   timeTakenSec: number
 * }
 */
export const submitQuiz = async (req, res) => {
  const { quizId, answers = [], timeTakenSec = 0 } = req.body;

  if (!quizId) {
    return res.status(400).json({ success: false, error: "quizId is required" });
  }

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ success: false, error: "Quiz not found" });
    if (quiz.status === "completed") {
      return res.status(400).json({ success: false, error: "Quiz already submitted" });
    }

    const userId = req.user._id || req.user.id;

    // Apply submitted answers and score
    let totalCorrect = 0;
    let easyCorrect = 0, mediumCorrect = 0, hardCorrect = 0;

    // Debug: log all correct_answer values to confirm they are letters
    console.log("📋 Correct answers from DB:", quiz.questions.map(q => q.correct_answer));
    console.log("📩 Submitted answers:", answers);

    const scoredQuestions = quiz.questions.map((q, idx) => {
      const answerEntry = answers.find(a => Number(a.questionIndex) === idx);
      // Normalise both sides: uppercase + trim to handle any case/whitespace variance
      const selected    = answerEntry?.selected != null
        ? String(answerEntry.selected).toUpperCase().trim()
        : null;
      const correctAns  = q.correct_answer
        ? String(q.correct_answer).toUpperCase().trim()
        : null;

      const isCorrect = selected !== null && correctAns !== null && selected === correctAns;
      if (isCorrect) {
        totalCorrect++;
        if (q.difficulty === "easy")   easyCorrect++;
        if (q.difficulty === "medium") mediumCorrect++;
        if (q.difficulty === "hard")   hardCorrect++;
      }

      console.log(`Q${idx}: stored=${correctAns}, submitted=${selected}, correct=${isCorrect}`);
      return { ...q.toObject(), selected_answer: selected, _correct: isCorrect };
    });

    const scorePercent = Math.round((totalCorrect / quiz.questions.length) * 100);
    const verified     = scorePercent >= 70;

    // ML prediction (graceful fallback if service is down)
    const mlResult = await predictSkillLevel({
      scorePercent,
      timeTakenSec,
      easyCorrect,
      mediumCorrect,
      hardCorrect,
      attemptNumber: quiz.attempt_number,
    });
    const { skill_level, confidence, probabilities } = mlResult;

    // Resolve skill_level: fall back to "Beginner" for roadmap lookup if ML returned "Unknown"
    const effectiveLevel = (skill_level && skill_level !== "Unknown") ? skill_level : "Beginner";

    // Generate + save roadmap (saveRoadmap handles skillProfiles persistence with normalised skill name)
    const roadmap = await generateRoadmap(quiz.skill, effectiveLevel);
    try {
      await saveRoadmap(userId, quiz.skill, effectiveLevel, roadmap);
    } catch (roadmapErr) {
      console.error("⚠️  saveRoadmap failed (non-fatal):", roadmapErr.message);
    }

    // Topic breakdown
    const topicBreakdown = buildTopicBreakdown(scoredQuestions);

    // Persist final quiz state
    quiz.status        = "completed";
    quiz.completed     = true;
    quiz.score         = totalCorrect;
    quiz.score_pct     = scorePercent;
    quiz.time_taken_sec = timeTakenSec;
    quiz.skill_level   = skill_level;
    quiz.confidence    = confidence;
    quiz.verified      = verified;
    quiz.questions     = scoredQuestions.map(sq => {
      const { _correct, ...rest } = sq;
      return rest;
    });
    await quiz.save();

    // skillProfiles persistence is handled by saveRoadmap() above (with normalised skill name).
    // Here we only update the verified flag + score on the existing entry that saveRoadmap created.
    // We use a case-insensitive match by finding the profile entry first, then updating by index.
    try {
      const latestUser = await User.findById(userId).select("skillProfiles");
      const profileIdx = latestUser?.skillProfiles?.findIndex(
        sp => sp.skill_name?.toLowerCase() === quiz.skill.toLowerCase()
      );

      if (profileIdx !== undefined && profileIdx !== -1) {
        // Update in-place using positional $ operator won't work with case-insensitive lookup;
        // use arrayFilters instead for precision.
        await User.findByIdAndUpdate(
          userId,
          {
            $set: {
              [`skillProfiles.${profileIdx}.verified`]:          verified,
              [`skillProfiles.${profileIdx}.verified_level`]:    effectiveLevel,
              [`skillProfiles.${profileIdx}.last_quiz_score`]:   scorePercent,
              [`skillProfiles.${profileIdx}.last_attempt_date`]: new Date(),
            }
          }
        );
      }
      // If no profile exists at all (saveRoadmap failed), push a minimal fallback entry
      else if (!latestUser?.skillProfiles?.length) {
        await User.findByIdAndUpdate(userId, {
          $push: {
            skillProfiles: {
              skill_name:        quiz.skill,
              verified,
              verified_level:    effectiveLevel,
              last_quiz_score:   scorePercent,
              last_attempt_date: new Date(),
              roadmap,
            }
          }
        });
      }
    } catch (profileErr) {
      console.error("⚠️  skillProfiles update failed (non-fatal):", profileErr.message);
    }

    // Also update verifiedSkills for backward compat
    if (verified) {
      await User.findOneAndUpdate(
        { _id: userId, "verifiedSkills.skill": quiz.skill },
        {
          $set: {
            "verifiedSkills.$.badge":       "Verified",
            "verifiedSkills.$.verifiedAt":  new Date(),
            "verifiedSkills.$.score":       totalCorrect,
            "verifiedSkills.$.total":       quiz.questions.length,
            "verifiedSkills.$.percentage":  scorePercent,
          }
        }
      ) || await User.findByIdAndUpdate(userId, {
        $push: {
          verifiedSkills: {
            skill:      quiz.skill,
            badge:      "Verified",
            verifiedAt: new Date(),
            score:      totalCorrect,
            total:      quiz.questions.length,
            percentage: scorePercent,
          }
        }
      });
    }

    // ─── Fire-and-forget: notify SkillNet Gateway of verification result ───
    if (verified) {
      const gatewayUrl = process.env.SKILLNET_GATEWAY_URL;
      console.log(`🔗 Verified! Notifying SkillNet Gateway at: ${gatewayUrl}`);
      console.log(`🔗 Skill: ${quiz.skill}, Level: ${effectiveLevel}, Auth header present: ${!!req.headers.authorization}`);
      if (gatewayUrl) {
        fetch(`${gatewayUrl}/api/skill-verification/verify-result`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": req.headers.authorization || "",
          },
          body: JSON.stringify({
            skill: quiz.skill,
            skill_level: effectiveLevel,
            confidence,
            attemptId: String(quiz._id),
          }),
        })
          .then(async (resp) => {
            const body = await resp.text();
            if (resp.ok) {
              console.log(`✅ SkillNet Gateway responded ${resp.status}: ${body}`);
            } else {
              console.error(`❌ SkillNet Gateway responded ${resp.status}: ${body}`);
            }
          })
          .catch(err => {
            console.error("⚠️  Fire-and-forget network error:", err.message);
          });
      } else {
        console.warn("⚠️  SKILLNET_GATEWAY_URL not set — skipping notification");
      }
    }

    // Build legacy report format for backward compat with QuizSummary
    // Use normalized selected_answer for reliable index lookup
    const report = scoredQuestions.map(q => {
      const selNorm  = q.selected_answer ? String(q.selected_answer).toUpperCase().trim() : null;
      const corrNorm = q.correct_answer  ? String(q.correct_answer).toUpperCase().trim()  : "A";
      return {
        question:      q.question,
        options:       q.options,
        userAnswer:    selNorm  ? (q.options[LETTER_TO_INDEX[selNorm]]  ?? selNorm)  : "No answer",
        correctAnswer: q.options[LETTER_TO_INDEX[corrNorm]] ?? corrNorm,
        isCorrect:     selNorm === corrNorm,
        difficulty:    q.difficulty,
        topic:         q.topic,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        quizId:         quiz._id,
        skill:          quiz.skill,
        score:          totalCorrect,
        total:          quiz.questions.length,
        scorePercent,
        verified,
        skill_level:    effectiveLevel,   // always Beginner/Intermediate/Advanced (never "Unknown")
        confidence,
        probabilities,
        easyCorrect,
        mediumCorrect,
        hardCorrect,
        topicBreakdown,
        roadmap,
        timeTakenSec,
        attemptNumber:  quiz.attempt_number,
        report,
      },
    });
  } catch (error) {
    console.error("submitQuiz error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// ─── GET QUIZ RESULT (for direct URL access) ──────────────────────────────────

/**
 * GET /api/quiz/:quizId/result
 * Returns stored quiz result — used as fallback when QuizResultPage is accessed by direct URL.
 */
export const getQuizResult = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).select(
      "skill score score_pct verified skill_level confidence attempt_number time_taken_sec questions createdAt"
    );
    if (!quiz) return res.status(404).json({ success: false, error: "Quiz not found" });

    const userId = req.user._id || req.user.id;
    if (quiz.user?.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, error: "Forbidden" });
    }

    // Rebuild topic breakdown from stored questions (normalise comparison)
    const scoredQuestions = quiz.questions.map(q => ({
      ...q.toObject(),
      _correct: q.selected_answer != null && q.correct_answer != null &&
        String(q.selected_answer).toUpperCase().trim() === String(q.correct_answer).toUpperCase().trim(),
    }));
    const topicBreakdown = buildTopicBreakdown(scoredQuestions);

    return res.status(200).json({
      success: true,
      data: {
        quizId:        quiz._id,
        skill:         quiz.skill,
        score:         quiz.score,
        total:         quiz.questions.length,
        scorePercent:  quiz.score_pct,
        verified:      quiz.verified,
        skill_level:   quiz.skill_level,
        confidence:    quiz.confidence,
        topicBreakdown,
        timeTakenSec:  quiz.time_taken_sec,
        attemptNumber: quiz.attempt_number,
      },
    });
  } catch (error) {
    console.error("getQuizResult error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};

// ─── GET QUIZ HISTORY ─────────────────────────────────────────────────────────

/**
 * GET /api/quiz/history/:studentId/:skill
 * Returns all past quiz attempts for a student + skill.
 */
export const getQuizHistory = async (req, res) => {
  try {
    const { studentId, skill } = req.params;

    const attempts = await Quiz.find({ user: studentId, skill })
      .sort({ createdAt: -1 })
      .select("score_pct skill_level verified attempt_number time_taken_sec createdAt");

    return res.status(200).json({ success: true, data: attempts });
  } catch (error) {
    console.error("getQuizHistory error:", error);
    return res.status(500).json({ success: false, error: "Server error" });
  }
};