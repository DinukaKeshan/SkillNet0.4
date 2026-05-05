const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434/api/generate";

/**
 * Repairs malformed JSON from LLM output.
 * Careful NOT to mangle apostrophes inside values (e.g. "Chrome's V8").
 */
function repairJson(raw) {
  return raw
    // Replace smart/curly quotes with regular quotes
    .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"')
    .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'")
    // Fix dot-prefixed field names LLM sometimes hallucinates (e.g. ".options" → "options")
    .replace(/"\.(\w+)"\s*:/g, '"$1":')
    // Remove trailing commas before } or ]
    .replace(/,\s*}/g, '}')
    .replace(/,\s*]/g, ']');
}

/**
 * Attempts multiple strategies to extract and parse JSON from raw LLM text.
 * Returns the parsed object/array on success, or throws on failure.
 */
function extractJson(rawText) {
  const errors = [];

  // Strategy 1: Direct parse of trimmed text (LLM returned clean JSON)
  try {
    return JSON.parse(rawText.trim());
  } catch (e) {
    errors.push(`Direct parse: ${e.message}`);
  }

  // Strategy 2: Extract JSON array between first '[' and last ']'
  const firstBracket = rawText.indexOf('[');
  const lastBracket  = rawText.lastIndexOf(']');
  if (firstBracket !== -1 && lastBracket > firstBracket) {
    const slice = rawText.slice(firstBracket, lastBracket + 1);
    try {
      return JSON.parse(slice);
    } catch (_) {
      // Try after repair
      try {
        return JSON.parse(repairJson(slice));
      } catch (e) {
        errors.push(`Array extraction: ${e.message}`);
      }
    }
  }

  // Strategy 3: Extract JSON object between first '{' and last '}'
  const firstBrace = rawText.indexOf('{');
  const lastBrace  = rawText.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const slice = rawText.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(slice);
    } catch (_) {
      try {
        return JSON.parse(repairJson(slice));
      } catch (e) {
        errors.push(`Object extraction: ${e.message}`);
      }
    }
  }

  // Strategy 4: Regex-based extraction (greedy match — fallback)
  const arrayMatch = rawText.match(/\[[\s\S]*\]/);
  if (arrayMatch) {
    try {
      return JSON.parse(repairJson(arrayMatch[0]));
    } catch (e) {
      errors.push(`Regex array: ${e.message}`);
    }
  }

  console.error("❌ All JSON extraction strategies failed:", errors.join(" | "));
  console.error("RAW:", rawText);
  throw new Error("Invalid JSON from Ollama");
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

  return extractJson(rawText);
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