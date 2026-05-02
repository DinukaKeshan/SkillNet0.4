import { retrieveContext } from "./retriever.js";
import { buildBatchQuizPrompt } from "./prompt.builder.js";
import { generateFromOllama } from "../ollama.service.js";
import { mapSkillToFolder } from "./skill.mapper.js";

const REQUIRED_FIELDS = ["question", "options", "correct_answer", "difficulty", "topic"];
const VALID_DIFFICULTIES = ["easy", "medium", "hard"];
const VALID_ANSWERS = ["A", "B", "C", "D"];

/**
 * Validates a single question object from the batch response.
 */
function validateQuestion(q) {
  if (!q || typeof q !== "object") return false;
  for (const field of REQUIRED_FIELDS) {
    if (!q[field]) return false;
  }
  if (!Array.isArray(q.options) || q.options.length !== 4) return false;
  if (!VALID_DIFFICULTIES.includes(q.difficulty)) return false;
  if (!VALID_ANSWERS.includes(q.correct_answer)) return false;
  return true;
}

/**
 * Generates a batch of exactly 10 quiz questions for a given skill.
 * Retries up to 3 times on invalid JSON or failed validation.
 *
 * @param {string}   skill         - Skill name (e.g. "React")
 * @param {string[]} excludeHashes - SHA-256 hashes of previously asked questions
 * @returns {Promise<object[]>}    - Array of 10 validated question objects
 */
export async function generateRagQuiz(skill, excludeHashes = []) {
  const folder = mapSkillToFolder(skill);
  if (!folder) throw new Error(`Unsupported skill: ${skill}`);

  const context = retrieveContext(folder);
  if (!context || context.trim().length === 0) {
    throw new Error(`No knowledge base found for skill: ${skill}`);
  }

  const MAX_RETRIES = 3;
  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`🎯 generateRagQuiz attempt ${attempt}/${MAX_RETRIES} for skill: ${skill}`);
      const prompt = buildBatchQuizPrompt(skill, context, excludeHashes);
      const result = await generateFromOllama(prompt);

      // Must be an array
      if (!Array.isArray(result)) {
        throw new Error(`Expected JSON array, got ${typeof result}`);
      }

      // Must have exactly 10 items
      if (result.length !== 10) {
        throw new Error(`Expected 10 questions, got ${result.length}`);
      }

      // Validate each question
      const invalid = result.findIndex(q => !validateQuestion(q));
      if (invalid !== -1) {
        throw new Error(`Question at index ${invalid} failed validation`);
      }

      console.log(`✅ Generated ${result.length} valid questions for ${skill}`);
      // Validation log: confirm all correct_answer values are uppercase letters
      const answerValues = result.map(q => q.correct_answer);
      console.log(`📋 correct_answer values: [${answerValues.join(", ")}]`);
      return result;

    } catch (err) {
      lastError = err;
      console.warn(`⚠️  Quiz generation attempt ${attempt} failed: ${err.message}`);
    }
  }

  throw new Error(`Quiz generation failed after ${MAX_RETRIES} retries: ${lastError?.message}`);
}

/**
 * Backward-compatible alias — kept so old imports don't break immediately.
 * @deprecated Use generateRagQuiz instead.
 */
export async function generateRagQuestion(skill) {
  const questions = await generateRagQuiz(skill, []);
  // Return just the first question in the old format for any legacy callers
  const q = questions[0];
  return {
    question:     q.question,
    options:      q.options,
    correctIndex: ["A", "B", "C", "D"].indexOf(q.correct_answer),
  };
}

