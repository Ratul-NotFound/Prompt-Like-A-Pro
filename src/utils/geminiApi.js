/**
 * Prompt Like A Pro — Client-Side Gemini Meta-Prompt Engine
 * TOKEN-EFFICIENT VERSION
 *
 * Principle: Maximum intelligence per token.
 * System instruction compressed 4x. Input trimmed. Output capped.
 * Gemini Flash prioritized over Pro (3× better free quota).
 */

// Flash first — 3x better free tier RPM/TPM than Pro
const GEMINI_MODEL_FALLBACKS = [
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-2.0-flash'
];

const MAX_RAW_INPUT_CHARS = 800;   // ~200 tokens
const MAX_OUTPUT_TOKENS   = 520;   // Dense prompt needs density, not length
const TEMPERATURE         = 0.68;

/**
 * Compressed system instruction — same reasoning depth, 4x fewer tokens.
 * ~120 tokens vs ~520 before.
 */
function buildSystemInstruction(domain) {
  return `You are an expert AI Prompt Engineer. Domain: "${domain.name}" (${domain.category}). Expert lens: ${domain.defaultRole || 'specialist'}.

PROCESS (silent, no output): 1) Infer user's REAL goal, not just what they typed. 2) Identify target audience, context, and missing constraints. 3) Determine ideal output format and depth.

THEN output ONE engineered prompt that: assigns a precise expert persona; states the real objective with context baked in; specifies deliverables and format; includes hard constraints blocking common failure modes; adds implicit context the user forgot.

RULES: Output ONLY the final prompt text. No preamble. No explanation. 120–250 words. Dense, specific, alive — not a template. Don't execute the task, engineer the prompt for it.`;
}

function trimRawInput(rawPrompt) {
  const trimmed = rawPrompt.trim();
  if (trimmed.length <= MAX_RAW_INPUT_CHARS) return trimmed;
  const cut = trimmed.slice(0, MAX_RAW_INPUT_CHARS);
  const lastSentence = cut.lastIndexOf('. ');
  return lastSentence > MAX_RAW_INPUT_CHARS * 0.6
    ? cut.slice(0, lastSentence + 1) + ' [trimmed]'
    : cut + '… [trimmed]';
}

function buildUserMessage(rawPrompt) {
  const safe = trimRawInput(rawPrompt);
  return `User's raw idea: "${safe}"\n\nEngineer the precision prompt now (output only the prompt, no intro):`;
}

export async function enhancePromptWithGemini(rawPrompt, domain, apiKey, model = 'gemini-2.5-flash') {
  if (apiKey && apiKey.trim()) {
    return await queryGoogleDirectly(rawPrompt, domain, apiKey, model);
  }

  // Route through secure backend proxy
  try {
    const response = await fetch('/api/enhance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawPrompt, domain, model })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Proxy Server Error: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error('Backend Proxy Request Failed:', err);
    throw err;
  }
}

async function queryGoogleDirectly(rawPrompt, domain, apiKey, targetModel) {
  const startIndex = Math.max(0, GEMINI_MODEL_FALLBACKS.indexOf(targetModel));
  const modelsToTry = GEMINI_MODEL_FALLBACKS.slice(startIndex);

  const systemInstruction = buildSystemInstruction(domain);
  const userMessage = buildUserMessage(rawPrompt);

  let lastError = null;

  for (const activeModel of modelsToTry) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${activeModel}:generateContent?key=${apiKey.trim()}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents: [{ role: 'user', parts: [{ text: userMessage }] }],
          generationConfig: {
            temperature: TEMPERATURE,
            maxOutputTokens: MAX_OUTPUT_TOKENS,
            topP: 0.92,
            candidateCount: 1
          }
        })
      });

      if (response.status === 404 || response.status === 429 || response.status === 503) {
        lastError = new Error(`HTTP ${response.status}`);
        continue;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Gemini API Error: ${response.status}`);
      }

      const data = await response.json();
      const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!resultText) throw new Error('Empty response.');

      return {
        text: resultText.trim(),
        fallbackUsed: activeModel !== targetModel,
        actualModelUsed: activeModel,
        providerUsed: 'Gemini AI'
      };
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('All fallback models exhausted.');
}
