/**
 * Core Multi-Provider AI Fallback Engine
 * Shared by Vercel Serverless Function (/api/enhance) and Vite Local Dev Server Middleware.
 *
 * TOKEN-EFFICIENT DEEP REASONING ENGINE
 * ─────────────────────────────────────
 * Principle: Maximum intelligence per token.
 * System instruction is compressed to ~120 tokens (dense directives, not verbose explanations).
 * User message is trimmed if raw input exceeds safe limits.
 * Output capped at 500 tokens — a great prompt is DENSE, not long.
 */

const GEMINI_MODEL_FALLBACKS = [
  'gemini-2.5-flash', // Flash first — better free quota than Pro
  'gemini-2.5-pro',
  'gemini-2.0-flash'
];

// ─── Token Budget Constants ──────────────────────────────────────────────────
const MAX_RAW_INPUT_CHARS = 800;    // ~200 tokens max for user input
const MAX_OUTPUT_TOKENS   = 520;    // Dense precision prompt — no padding needed
const TEMPERATURE         = 0.68;   // Creative but controlled

/**
 * COMPRESSED SYSTEM INSTRUCTION
 * Same 3-stage reasoning, but written in dense directive form.
 * ~120 tokens vs ~520 before — 4x token savings per request.
 */
function buildSystemInstruction(domain) {
  return `You are an expert AI Prompt Engineer. Domain: "${domain.name}" (${domain.category}). Expert lens: ${domain.defaultRole || 'specialist'}.

PROCESS (silent, no output): 1) Infer user's REAL goal, not just what they typed. 2) Identify target audience, context, and missing constraints. 3) Determine ideal output format and depth.

THEN output ONE engineered prompt that: assigns a precise expert persona; states the real objective with context baked in; specifies deliverables and format; includes hard constraints blocking common failure modes; adds implicit context the user forgot.

RULES: Output ONLY the final prompt text. No preamble. No explanation. 120–250 words. Dense, specific, alive — not a template. Don't execute the task, engineer the prompt for it.`;
}

/**
 * Smart input trimmer — preserves meaning while cutting token waste.
 * If raw input > MAX_RAW_INPUT_CHARS, intelligently truncates.
 */
function trimRawInput(rawPrompt) {
  const trimmed = rawPrompt.trim();
  if (trimmed.length <= MAX_RAW_INPUT_CHARS) return trimmed;

  // Cut to limit but end at last complete sentence if possible
  const cut = trimmed.slice(0, MAX_RAW_INPUT_CHARS);
  const lastSentence = cut.lastIndexOf('. ');
  return lastSentence > MAX_RAW_INPUT_CHARS * 0.6
    ? cut.slice(0, lastSentence + 1) + ' [trimmed for token efficiency]'
    : cut + '… [trimmed for token efficiency]';
}

function buildUserMessage(rawPrompt) {
  const safe = trimRawInput(rawPrompt);
  return `User's raw idea: "${safe}"\n\nEngineer the precision prompt now (output only the prompt, no intro):`;
}

// ─── Token estimation helper ──────────────────────────────────────────────────
function estimateTokens(str) {
  return Math.ceil((str || '').length / 4);
}

export function getTotalRequestTokenEstimate(rawPrompt, domain) {
  const sysTokens = estimateTokens(buildSystemInstruction(domain));
  const userTokens = estimateTokens(buildUserMessage(rawPrompt));
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
  const userMessage = buildUserMessage(rawPrompt);

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
  // PROVIDER 2: Groq Cloud — fastest free inference (6k TPM)
  // Prefer smaller+faster models to preserve minute budget
  // ---------------------------------------------------------------------------
  const groqKeys = parseKeys(env.GROQ_KEYS || env.GROQ_API_KEY);
  if (groqKeys.length > 0) {
    // Ordered: smaller/faster first to maximize free quota
    const groqModels = [
      'llama-3.1-8b-instant',    // Fastest, cheapest on quota
      'llama3-8b-8192',
      'llama-3.3-70b-versatile', // Higher quality, more tokens
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
