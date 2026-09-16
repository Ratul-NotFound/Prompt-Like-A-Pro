/**
 * Prompt Like A Pro — Client-Side Gemini Meta-Prompt Engine
 *
 * ════════════════════════════════════════════════════════════════════════
 * DEEP INTENT ANALYSIS & PRECISION PROMPT SYNTHESIS ENGINE
 * ════════════════════════════════════════════════════════════════════════
 * Philosophy: Understand what the user ACTUALLY wants, not just what they typed.
 *
 * TOKEN BUDGET (Free-Tier Safe):
 *   System  : ~280t  (5-stage reasoning scaffold)
 *   User msg: ~200t  (trimmed input + domain signals)
 *   Output  : ≤650t  (complete, non-truncated precision prompt)
 *   Total   : ~730t/request → Gemini Flash free tier: ~1,300+ requests/day ✓
 */

// Flash first — 15 RPM / 1M TPD free tier
const GEMINI_MODEL_FALLBACKS = [
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-2.0-flash'
];

const MAX_RAW_INPUT_CHARS = 900;   // ~225t — slightly more room for context
const MAX_OUTPUT_TOKENS   = 700;   // Room for verified, complete precision prompt
const TEMPERATURE         = 0.72;  // Creative synthesis, still controlled

/**
 * 5-STAGE DEEP REASONING SCAFFOLD
 * ─────────────────────────────────
 * Mirrors the backend scaffold exactly. Guides the AI through the exact
 * mental process a world-class prompt engineer uses.
 * ~280t — 160t more than before, but produces 10x better outputs.
 * Still free-tier safe on Gemini Flash (1M tokens/day).
 */
function buildSystemInstruction(domain) {
  return `You are a world-class AI Prompt Engineer. Domain: "${domain.name}" (${domain.category}). Specialist lens: ${domain.defaultRole || 'expert practitioner'}.

REASONING (internal, never output):
STAGE 1 — DECONSTRUCT: What did the user actually write? Strip filler words and noise. Extract the core verbs, nouns, and intent signals. What is the literal stated request?
STAGE 2 — DIAGNOSE: What do they *actually need*? The stated request is almost always a proxy for a deeper goal. Identify: the real desired outcome, the actual problem being solved, who benefits, and what success looks like.
STAGE 3 — GAP-FILL: What critical elements are missing from their draft? Audit for absent: expert persona, target audience, output format, scope boundaries, quality criteria, failure guardrails, and implicit context. These gaps cause AI to produce mediocre outputs.
STAGE 4 — TARGET: Who or what will execute this prompt? (ChatGPT for writing/reasoning, Claude for analysis/long-form, Gemini for code/multimodal, Midjourney for visuals, an autonomous agent for tasks, a specialized tool). Optimize prompt structure and language for that executor.
STAGE 5 — SYNTHESIZE: Write the engineered prompt. It must: (a) open with a precise, credentialed expert persona assignment; (b) state the REAL objective with all diagnosed context embedded — not the surface request; (c) define exact deliverables with success criteria; (d) include hard constraints that pre-empt the top 3 failure modes for this request type; (e) specify output format, length, and structure explicitly.
STAGE 6 — VERIFY (self-critique before outputting): Check your synthesized prompt against these 5 gates: ① Does it assign a specific expert persona? ② Does it state the REAL goal (not the surface request)? ③ Does it define what a good output looks like? ④ Does it have at least 2 hard constraints? ⑤ Does it specify output format? If any gate fails, revise the prompt before outputting.

OUTPUT RULES:
- Output ONLY the final verified prompt. Zero preamble. Zero explanation. Zero meta-commentary.
- 150–300 words. Dense, specific, unambiguous — not a template with blanks.
- Do NOT execute the task. Engineer the prompt that extracts the best possible result from any AI.
- Start directly with the persona assignment or the core directive. No soft openers.`;
}

/**
 * Enriched user message — gives the AI domain context as extra signal.
 * Minimal token cost, significant quality improvement.
 */
function buildUserMessage(rawPrompt, domain) {
  const safe = trimRawInput(rawPrompt);
  const domainHint = domain ? ` [Domain: ${domain.name}, Category: ${domain.category}]` : '';
  return `User's raw draft${domainHint}:\n"${safe}"\n\nApply your 5-stage reasoning. Output only the engineered prompt:`;
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
  const userMessage = buildUserMessage(rawPrompt, domain);

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
