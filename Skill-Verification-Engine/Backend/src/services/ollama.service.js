const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434/api/generate";

/**
 * Repairs malformed JSON from LLM output
 */
function repairJson(raw) {
  return raw
    // Replace smart quotes with regular quotes
    .replace(/[""]/g, '"')
    // Replace single-quoted keys with double quotes
    .replace(/'([^']+)'(?=\s*:)/g, '"$1"')
    // Replace single-quoted values with double quotes
    .replace(/:\s*'([^']*)'/g, ': "$1"')
    .replace(/'([^']*)'/g, '"$1"')
    // Remove trailing commas
    .replace(/,\s*}/g, '}')
    .replace(/,\s*]/g, ']');
}

/**
 * Generates JSON output (object or array) from Ollama using a supplied prompt.
 * Handles both top-level JSON objects {...} and arrays [...].
 */
export async function generateFromOllama(prompt) {
  const response = await fetch(OLLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: process.env.OLLAMA_MODEL || "llama3",
      prompt,
      stream: false,
    })
  });

  if (!response.ok) {
    throw new Error(`Ollama request failed: ${response.status}`);
  }

  const data = await response.json();
  const rawText = data.response;

  console.log("🦙 RAW OLLAMA OUTPUT:\n", rawText);

  // First try to extract a JSON array [...]
  const arrayMatch = rawText.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    try {
      const repaired = repairJson(arrayMatch[0]);
      return JSON.parse(repaired);
    } catch (_) {
      // fall through to object extraction
    }
  }

  // Fall back to JSON object {...}
  const objectMatch = rawText.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    try {
      const repaired = repairJson(objectMatch[0]);
      return JSON.parse(repaired);
    } catch (err) {
      console.error("❌ JSON PARSE FAILED");
      console.error("RAW:", rawText);
      throw new Error("Invalid JSON from Ollama");
    }
  }

  console.error("❌ No JSON found in Ollama output");
  console.error("RAW:", rawText);
  throw new Error("No JSON found in Ollama output");
}

/**
 * (Optional) Backward compatibility
 * Allows old calls: generateQuestion(skill)
 */
export async function generateQuestion(skill) {
  const prompt = `
Generate ONE multiple-choice question for ${skill}.

STRICT RULES:
- Respond with ONLY a JSON object
- No explanation
- No markdown
- No text outside JSON

JSON FORMAT:
{
  "question": "string",
  "options": ["string", "string", "string", "string"],
  "correctIndex": number
}
`;

  return generateFromOllama(prompt);
}