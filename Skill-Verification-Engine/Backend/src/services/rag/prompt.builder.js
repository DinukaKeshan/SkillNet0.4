/**
 * Builds the prompt for batch generating 10 quiz questions in one Ollama call.
 *
 * @param {string}   skill         - The skill name (e.g. "React")
 * @param {string}   context       - RAG context text
 * @param {string[]} excludeHashes - Ignored here; we hint via topics instead
 * @returns {string} Prompt string
 */
export function buildBatchQuizPrompt(skill, context, excludeHashes = []) {
  const exclusionHint = excludeHashes.length > 0
    ? `\nIMPORTANT: Do NOT repeat questions on topics that have already been covered in previous quiz attempts. Focus on fresh subtopics within ${skill}.`
    : "";

  return `You are a strict technical quiz examiner for ${skill}.

CONTEXT (use ONLY the information below to form questions):
${context}

TASK:
Generate exactly 10 multiple-choice questions about ${skill}.
${exclusionHint}

DIFFICULTY DISTRIBUTION (must follow exactly):
- 3 questions: difficulty = "easy"
- 4 questions: difficulty = "medium"
- 3 questions: difficulty = "hard"

RULES:
- Each question must have exactly 4 answer options (A, B, C, D).
- The correct_answer field must be exactly one of: "A", "B", "C", or "D".
- The topic field must be a specific subtopic within ${skill} (e.g. "React Hooks", "State Management", "JSX Syntax").
- Every fact used must be grounded in the CONTEXT above.
- Output ONLY a valid JSON array. No markdown. No code fences. No explanation. No preamble. No trailing text.

OUTPUT FORMAT (strict JSON array, no other text):
[
  {
    "question": "What does X do in ${skill}?",
    "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
    "correct_answer": "B",
    "difficulty": "easy",
    "topic": "Subtopic name"
  }
]

Generate all 10 questions now. Return ONLY the JSON array.`;
}