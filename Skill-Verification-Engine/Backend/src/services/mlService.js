/**
 * mlService.js — Node.js bridge to the Python ML prediction microservice.
 * Calls http://localhost:8000/predict after each quiz submission.
 */

const ML_API_URL = process.env.ML_API_URL || "http://localhost:8000/predict";
const TIMEOUT_MS = 5000;

/**
 * Predicts the student's skill level using the Python ML microservice.
 *
 * @param {object} quizResult
 * @param {number} quizResult.scorePercent   - Overall score percentage (0–100)
 * @param {number} quizResult.timeTakenSec   - Total seconds taken
 * @param {number} quizResult.easyCorrect    - Correct answers on easy questions (0–3)
 * @param {number} quizResult.mediumCorrect  - Correct answers on medium questions (0–4)
 * @param {number} quizResult.hardCorrect    - Correct answers on hard questions (0–3)
 * @param {number} quizResult.attemptNumber  - Which attempt this is (1–5)
 *
 * @returns {Promise<{skill_level: string, confidence: number, probabilities: object}>}
 */
export async function predictSkillLevel({
  scorePercent,
  timeTakenSec,
  easyCorrect,
  mediumCorrect,
  hardCorrect,
  attemptNumber,
}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(ML_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        score_pct:      scorePercent,
        time_taken_sec: timeTakenSec,
        easy_correct:   easyCorrect,
        medium_correct: mediumCorrect,
        hard_correct:   hardCorrect,
        attempt_number: attemptNumber,
      }),
    });

    if (!response.ok) {
      throw new Error(`ML service returned HTTP ${response.status}`);
    }

    const data = await response.json();
    return {
      skill_level:   data.skill_level   ?? "Unknown",
      confidence:    data.confidence    ?? 0,
      probabilities: data.probabilities ?? {},
    };

  } catch (err) {
    if (err.name === "AbortError") {
      console.warn("⏱️  ML service timed out — returning fallback");
    } else {
      console.warn("⚠️  ML service unavailable:", err.message);
    }
    // Graceful fallback — does not crash the quiz submission
    return { skill_level: "Unknown", confidence: 0, probabilities: {} };
  } finally {
    clearTimeout(timer);
  }
}
