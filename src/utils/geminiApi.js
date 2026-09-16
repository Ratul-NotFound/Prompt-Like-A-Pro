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
 * Mode-specific format directive — mirrors backend logic exactly.
 */
function buildPromptModeDirective(promptMode, targetAI) {
  const modeDirectives = {
    system_prompt: `\nOUTPUT FORMAT — SYSTEM PROMPT:\nUse blocks: [IDENTITY] [CAPABILITIES] [BEHAVIOR RULES] [GUARDRAILS] [OUTPUT FORMAT]. Each: 2-5 bullets. Strict, imperative.`,
    few_shot: `\nOUTPUT FORMAT — FEW-SHOT:\nTask: [description]\nExample 1: Input: [...] Output: [...]\nExample 2: Input: [...] Output: [...]\nExample 3: Input: [...] Output: [...]\n---\nInput: {{USER_INPUT}}\nOutput:`,
    chain_of_thought: `\nOUTPUT FORMAT — CHAIN-OF-THOUGHT:\nPrompt must instruct: start with "Let me think step by step", show numbered reasoning, end with "Therefore: [answer]".`,
    json_output: `\nOUTPUT FORMAT — JSON:\nReturn ONLY valid JSON. Include schema, field types, example, and fallback null instruction.`,
    user_turn: `\nOUTPUT FORMAT — USER TURN:\nWrite a single user message in first person. No system-level language. Specific, contextual, format-specified.`,
    universal: ''
  };
  const targetHints = {
    chatgpt:      '\nTARGET: ChatGPT/GPT-4o — conversational, markdown, role-play friendly.',
    claude:       '\nTARGET: Claude — use <task>, <context>, <instructions> XML tags.',
    gemini:       '\nTARGET: Gemini — structured sections, code-aware, explicit step instructions.',
    midjourney:   '\nTARGET: Midjourney — pure image prompt: subject, style, camera, lighting, --ar --v flags.',
    coding_agent: '\nTARGET: Coding Agent — ultra-precise spec, file paths, function signatures, zero ambiguity.',
    perplexity:   '\nTARGET: Perplexity — research framing, request sources and citation format.',
    universal:    ''
  };
  return (modeDirectives[promptMode] || '') + (targetHints[targetAI] || '');
}

/**
 * System instruction — 6-stage scaffold + mode-aware format directive.
 */
function buildSystemInstruction(domain, promptMode = 'universal', targetAI = 'universal') {
  const modeSection = buildPromptModeDirective(promptMode, targetAI);
  return `You are a world-class AI Prompt Engineer. Domain: "${domain.name}" (${domain.category}). Specialist lens: ${domain.defaultRole || 'expert practitioner'}.

REASONING (internal, never output):
STAGE 1 — DECONSTRUCT: Strip filler. Extract core verbs, nouns, intent signals.
STAGE 2 — DIAGNOSE: Identify the REAL goal behind the stated request. Who benefits? What does success look like?
STAGE 3 — GAP-FILL: Audit for absent: persona, audience, format, constraints, guardrails, context.
STAGE 4 — TARGET: Who executes this prompt? Optimize structure for that executor.
STAGE 5 — SYNTHESIZE: Specific persona + real objective + exact deliverables + hard constraints + explicit format.
STAGE 6 — VERIFY: 5 gates: \u2460 specific persona? \u2461 real goal? \u2462 success defined? \u2463 2+ constraints? \u2464 format specified? Revise if any fail.${modeSection}

OUTPUT RULES:
- Output ONLY the final verified prompt. Zero preamble. Zero meta-commentary.
- 150\u2013300 words. Dense, unambiguous. Do NOT execute the task.
- Start with persona or core directive. No soft openers.`;
}

/**
 * Enriched user message — gives the AI domain context as extra signal.
 * Minimal token cost, significant quality improvement.
 */
function buildUserMessage(rawPrompt, domain, tunerSettings = {}) {
  const safe = trimRawInput(rawPrompt);
  const domainHint   = domain ? ` [Domain: ${domain.name}, Category: ${domain.category}]` : '';
  const targetAIHint = tunerSettings.targetAI && tunerSettings.targetAI !== 'universal' ? ` [Target AI: ${tunerSettings.targetAI}]` : '';
  const modeHint     = tunerSettings.promptMode && tunerSettings.promptMode !== 'universal' ? ` [Prompt Mode: ${tunerSettings.promptMode}]` : '';
  return `User's raw draft${domainHint}${targetAIHint}${modeHint}:\n"${safe}"\n\nApply your 6-stage reasoning. Output only the engineered prompt:`;
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

export async function enhancePromptWithGemini(rawPrompt, domain, apiKey, model = 'gemini-2.5-flash', tunerSettings = {}) {
  if (apiKey && apiKey.trim()) {
    return await queryGoogleDirectly(rawPrompt, domain, apiKey, model, tunerSettings);
  }

  // Route through secure backend proxy
  try {
    const response = await fetch('/api/enhance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawPrompt, domain, model, tunerSettings })
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

async function queryGoogleDirectly(rawPrompt, domain, apiKey, targetModel, tunerSettings = {}) {
  const startIndex = Math.max(0, GEMINI_MODEL_FALLBACKS.indexOf(targetModel));
  const modelsToTry = GEMINI_MODEL_FALLBACKS.slice(startIndex);

  const systemInstruction = buildSystemInstruction(domain, tunerSettings.promptMode, tunerSettings.targetAI);
  const userMessage       = buildUserMessage(rawPrompt, domain, tunerSettings);

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
