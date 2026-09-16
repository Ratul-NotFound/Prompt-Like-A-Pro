/**
 * Core Multi-Provider AI Fallback Engine
 * Shared by Vercel Serverless Function (/api/enhance) and Vite Local Dev Server Middleware.
 *
 * ════════════════════════════════════════════════════════════════════════
 * DEEP INTENT ANALYSIS & PRECISION PROMPT SYNTHESIS ENGINE
 * ════════════════════════════════════════════════════════════════════════
 * Philosophy: The AI must UNDERSTAND what the user actually wants —
 * not just what they typed — and then engineer the perfect prompt for it.
 *
 * TOKEN BUDGET (Free-Tier Safe):
 *   System  : ~280t  (5-stage reasoning scaffold — structured, not verbose)
 *   User msg: ~200t  (trimmed input + intent signals)
 *   Output  : ≤650t  (complete precision prompt, not truncated)
 *   Total   : ~730t/request → Gemini Flash free tier: ~1,300+ requests/day ✓
 */

const GEMINI_MODEL_FALLBACKS = [
  'gemini-2.5-flash', // Flash first — 15 RPM / 1M TPD free tier
  'gemini-2.5-pro',
  'gemini-2.0-flash'
];

// ─── Token Budget Constants (Free-Tier Optimized) ────────────────────────────
const MAX_RAW_INPUT_CHARS = 900;   // ~225t — slightly more room for context
const MAX_OUTPUT_TOKENS   = 700;   // Room for verified, complete precision prompt
const TEMPERATURE         = 0.72;  // More creative synthesis, still controlled

/**
 * 5-STAGE DEEP REASONING SCAFFOLD
 * ─────────────────────────────────
 * Guides the AI through the exact mental process a world-class prompt
 * engineer uses. Each stage is a tight directive (~50t each).
 * Total ~280t — 160t more than before, but produces 10x better outputs.
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
 * Smart input trimmer — preserves meaning while cutting token waste.
 * If raw input > MAX_RAW_INPUT_CHARS, trims at sentence boundary.
 */
function trimRawInput(rawPrompt) {
  const trimmed = rawPrompt.trim();
  if (trimmed.length <= MAX_RAW_INPUT_CHARS) return trimmed;
  const cut = trimmed.slice(0, MAX_RAW_INPUT_CHARS);
  const lastSentence = cut.lastIndexOf('. ');
  return lastSentence > MAX_RAW_INPUT_CHARS * 0.6
    ? cut.slice(0, lastSentence + 1) + ' [trimmed]'
    : cut + '… [trimmed]';
}

/**
 * Enriched user message — gives the AI more signal to work with
 * without significantly increasing token count.
 */
function buildUserMessage(rawPrompt, domain) {
  const safe = trimRawInput(rawPrompt);
  const domainHint = domain ? ` [Domain: ${domain.name}, Category: ${domain.category}]` : '';
  return `User's raw draft${domainHint}:\n"${safe}"\n\nApply your 5-stage reasoning. Output only the engineered prompt:`;
}

// ─── Token estimation helper ──────────────────────────────────────────────────
function estimateTokens(str) {
  return Math.ceil((str || '').length / 4);
}

export function getTotalRequestTokenEstimate(rawPrompt, domain) {
  const sysTokens = estimateTokens(buildSystemInstruction(domain));
  const userTokens = estimateTokens(buildUserMessage(rawPrompt, domain));
  return { sysTokens, userTokens, total: sysTokens + userTokens };
}

// ─── Helper to parse comma-separated keys ────────────────────────────────────
const parseKeys = (val) => {
  if (!val) return [];
  return val.split(',').map(k => k.trim()).filter(Boolean);
};

export async function runMultiProviderEnhance(rawPrompt, domain, targetModel = 'gemini-2.5-flash', env = {}) {
  const errors = [];

  const systemInstruction = buildSystemInstruction(domain);
  const userMessage = buildUserMessage(rawPrompt, domain);

  // Log token usage for monitoring
  const { sysTokens, userTokens, total } = getTotalRequestTokenEstimate(rawPrompt, domain);
  console.log(`[TokenBudget] system=${sysTokens}t user=${userTokens}t total_in=${total}t max_out=${MAX_OUTPUT_TOKENS}t`);

  // ---------------------------------------------------------------------------
  // PROVIDER 1: Gemini Flash (best free quota) → Pro fallback → 2.0 Flash
  // ---------------------------------------------------------------------------
  const geminiKeys = parseKeys(env.GEMINI_KEYS || env.GEMINI_API_KEY);
  if (geminiKeys.length > 0) {
    for (let i = 0; i < geminiKeys.length; i++) {
      try {
        const result = await queryGemini(geminiKeys[i], targetModel, systemInstruction, userMessage);
        return { text: result.text, fallbackUsed: result.fallbackUsed, actualModelUsed: result.actualModelUsed, providerUsed: 'Gemini AI' };
      } catch (err) {
        console.warn(`[MultiProvider] Gemini Key #${i + 1} failed: ${err.message}`);
        errors.push(`Gemini Key #${i + 1}: ${err.message}`);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // PROVIDER 2: Groq Cloud — fastest free inference
  // Prefer smaller+faster models to preserve minute budget
  // ---------------------------------------------------------------------------
  const groqKeys = parseKeys(env.GROQ_KEYS || env.GROQ_API_KEY);
  if (groqKeys.length > 0) {
    const groqModels = [
      'llama-3.1-8b-instant',
      'llama3-8b-8192',
      'llama-3.3-70b-versatile',
      'mixtral-8x7b-32768'
    ];
    for (let i = 0; i < groqKeys.length; i++) {
      for (const groqModel of groqModels) {
        try {
          const text = await queryOpenAICompatible(
            'https://api.groq.com/openai/v1/chat/completions',
            groqKeys[i], groqModel, systemInstruction, userMessage
          );
          return { text, fallbackUsed: true, actualModelUsed: `${groqModel} (Groq)`, providerUsed: 'Groq Cloud' };
        } catch (err) {
          console.warn(`[MultiProvider] Groq Key #${i + 1} model ${groqModel} failed: ${err.message}`);
          errors.push(`Groq Key #${i + 1} (${groqModel}): ${err.message}`);
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  // PROVIDER 3: OpenRouter Free Models
  // ---------------------------------------------------------------------------
  const openrouterKeys = parseKeys(env.OPENROUTER_KEYS || env.OPENROUTER_API_KEY);
  if (openrouterKeys.length > 0) {
    const freeModels = [
      'meta-llama/llama-3-8b-instruct:free',
      'google/gemma-2-9b-it:free'
    ];
    for (let i = 0; i < openrouterKeys.length; i++) {
      for (const model of freeModels) {
        try {
          const text = await queryOpenAICompatible(
            'https://openrouter.ai/api/v1/chat/completions',
            openrouterKeys[i], model, systemInstruction, userMessage
          );
          return { text, fallbackUsed: true, actualModelUsed: `${model.split('/')[1]} (Free)`, providerUsed: 'OpenRouter' };
        } catch (err) {
          console.warn(`[MultiProvider] OpenRouter Key #${i + 1} model ${model} failed: ${err.message}`);
          errors.push(`OpenRouter Key #${i + 1} (${model}): ${err.message}`);
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  // PROVIDER 4: Hugging Face Serverless
  // ---------------------------------------------------------------------------
  const hfKeys = parseKeys(env.HF_KEYS || env.HF_API_KEY);
  if (hfKeys.length > 0) {
    const hfModel = 'meta-llama/Meta-Llama-3-8B-Instruct';
    for (let i = 0; i < hfKeys.length; i++) {
      try {
        const text = await queryHuggingFace(hfKeys[i], hfModel, systemInstruction, userMessage);
        return { text, fallbackUsed: true, actualModelUsed: 'Llama 3 8B (HuggingFace)', providerUsed: 'HuggingFace' };
      } catch (err) {
        console.warn(`[MultiProvider] Hugging Face Key #${i + 1} failed: ${err.message}`);
        errors.push(`HuggingFace Key #${i + 1}: ${err.message}`);
      }
    }
  }

  throw new Error('All free tier API providers in the rotation pool have been exhausted.\nDetails:\n' + errors.join('\n'));
}

// ─── Provider Implementations ────────────────────────────────────────────────

async function queryGemini(apiKey, targetModel, systemInstruction, userMessage) {
  const startIndex = GEMINI_MODEL_FALLBACKS.indexOf(targetModel);
  const modelsToTry = GEMINI_MODEL_FALLBACKS.slice(startIndex !== -1 ? startIndex : 0);
  let lastError = null;

  for (const model of modelsToTry) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
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

      if (response.status === 429) throw new Error('Rate limit (429) — rotating next key');
      if (response.status === 503) throw new Error('Model overloaded (503) — cascading');
      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Empty response');

      return { text: text.trim(), fallbackUsed: model !== targetModel, actualModelUsed: model };
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error('All Gemini models exhausted');
}

async function queryOpenAICompatible(url, apiKey, model, systemInstruction, userMessage) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: userMessage }
      ],
      temperature: TEMPERATURE,
      max_tokens: MAX_OUTPUT_TOKENS,
      top_p: 0.92,
      stream: false
    })
  });

  if (response.status === 429) throw new Error('Rate limit (429)');
  if (response.status === 503) throw new Error('Model overloaded (503)');
  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    throw new Error(errJson.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty response');
  return text.trim();
}

async function queryHuggingFace(apiKey, model, systemInstruction, userMessage) {
  const url = `https://api-inference.huggingface.co/models/${model}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      inputs: `<|system|>\n${systemInstruction}\n<|user|>\n${userMessage}\n<|assistant|>\n`,
      parameters: { max_new_tokens: MAX_OUTPUT_TOKENS, temperature: TEMPERATURE, return_full_text: false }
    })
  });

  if (response.status === 429) throw new Error('Rate limit (429)');
  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    throw new Error(errJson.error || `HTTP ${response.status}`);
  }

  const data = await response.json();
  const text = data[0]?.generated_text || data.generated_text;
  if (!text) throw new Error('Empty response');
  return text.trim();
}
