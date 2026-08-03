/**
 * Core Multi-Provider AI Fallback Engine
 * Shared by Vercel Serverless Function (/api/enhance) and Vite Local Dev Server Middleware.
 */

const GEMINI_MODEL_FALLBACKS = [
  'gemini-2.5-pro',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-pro',
  'gemini-1.5-flash'
];

export async function runMultiProviderEnhance(rawPrompt, domain, targetModel = 'gemini-2.5-pro', env = {}) {
  const errors = [];

  const systemInstruction = `You are a Master AI Prompt Engineer and AI Meta-Prompting Specialist.
Your task is to take a raw, unstructured user prompt and transform it into a hyper-optimized, production-grade prompt for the target domain: "${domain.name}" (${domain.category}).

RULES FOR ENHANCEMENT:
1. Define a clear, expert persona for the AI (e.g. "Act as a...").
2. Contextualize the objective and elaborate on missing details intelligently.
3. Add explicit tone, audience, and formatting instructions.
4. Add domain-specific negative constraints to prevent generic AI fluff.
5. Use clean Markdown formatting with clear section headers.
6. DO NOT answer or fulfill the prompt yourself! Your ONLY output must be the ENHANCED PROMPT text itself so the user can copy and paste it into their LLM.`;

  const userMessage = `Target Domain: ${domain.name}
Role/Persona: ${domain.defaultRole}

RAW USER PROMPT TO ENHANCE:
"${rawPrompt.trim()}"

Please generate the enhanced, professionally engineered prompt now:`;

  // Helper to parse comma-separated keys
  const parseKeys = (val) => {
    if (!val) return [];
    return val.split(',').map(k => k.trim()).filter(Boolean);
  };

  // ---------------------------------------------------------------------------
  // PROVIDER 1: Gemini AI Pool
  // ---------------------------------------------------------------------------
  const geminiKeys = parseKeys(env.GEMINI_KEYS || env.GEMINI_API_KEY);
  if (geminiKeys.length > 0) {
    for (let i = 0; i < geminiKeys.length; i++) {
      try {
        const result = await queryGemini(rawPrompt, domain, geminiKeys[i], targetModel, systemInstruction, userMessage);
        return {
          text: result.text,
          fallbackUsed: result.fallbackUsed,
          actualModelUsed: result.actualModelUsed,
          providerUsed: 'Gemini AI'
        };
      } catch (err) {
        console.warn(`[MultiProvider] Gemini Key #${i + 1} failed: ${err.message}`);
        errors.push(`Gemini Key #${i + 1}: ${err.message}`);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // PROVIDER 2: Groq Cloud API Pool
  // ---------------------------------------------------------------------------
  const groqKeys = parseKeys(env.GROQ_KEYS || env.GROQ_API_KEY);
  if (groqKeys.length > 0) {
    const groqModels = ['llama3-8b-8192', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'];
    for (let i = 0; i < groqKeys.length; i++) {
      for (const groqModel of groqModels) {
        try {
          const text = await queryOpenAICompatible(
            'https://api.groq.com/openai/v1/chat/completions',
            groqKeys[i],
            groqModel,
            systemInstruction,
            userMessage
          );
          return {
            text,
            fallbackUsed: true,
            actualModelUsed: `${groqModel} (Groq)`,
            providerUsed: 'Groq Cloud'
          };
        } catch (err) {
          console.warn(`[MultiProvider] Groq Key #${i + 1} model ${groqModel} failed: ${err.message}`);
          errors.push(`Groq Key #${i + 1} (${groqModel}): ${err.message}`);
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  // PROVIDER 3: OpenRouter Free Models Pool
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
            openrouterKeys[i],
            model,
            systemInstruction,
            userMessage
          );
          return {
            text,
            fallbackUsed: true,
            actualModelUsed: `${model.split('/')[1]} (Free)`,
            providerUsed: 'OpenRouter'
          };
        } catch (err) {
          console.warn(`[MultiProvider] OpenRouter Key #${i + 1} model ${model} failed: ${err.message}`);
          errors.push(`OpenRouter Key #${i + 1} (${model}): ${err.message}`);
        }
      }
    }
  }

  // ---------------------------------------------------------------------------
  // PROVIDER 4: Hugging Face Serverless Pool
  // ---------------------------------------------------------------------------
  const hfKeys = parseKeys(env.HF_KEYS || env.HF_API_KEY);
  if (hfKeys.length > 0) {
    const hfModel = 'meta-llama/Meta-Llama-3-8B-Instruct';
    for (let i = 0; i < hfKeys.length; i++) {
      try {
        const text = await queryHuggingFace(hfKeys[i], hfModel, systemInstruction, userMessage);
        return {
          text,
          fallbackUsed: true,
          actualModelUsed: 'Llama 3 8B (HuggingFace)',
          providerUsed: 'HuggingFace'
        };
      } catch (err) {
        console.warn(`[MultiProvider] Hugging Face Key #${i + 1} failed: ${err.message}`);
        errors.push(`HuggingFace Key #${i + 1}: ${err.message}`);
      }
    }
  }

  throw new Error('All free tier API providers in the rotation pool have been exhausted.\nDetails:\n' + errors.join('\n'));
}

async function queryGemini(rawPrompt, domain, apiKey, targetModel, systemInstruction, userMessage) {
  const startIndex = GEMINI_MODEL_FALLBACKS.indexOf(targetModel);
  const activeStartIndex = startIndex !== -1 ? startIndex : 0;
  const modelsToTry = GEMINI_MODEL_FALLBACKS.slice(activeStartIndex);

  let lastError = null;

  for (const model of modelsToTry) {
    const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: systemInstruction + '\n\n' + userMessage }]
            }
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 2000
          }
        })
      });

      if (response.status === 429) {
        throw new Error('Rate limit exceeded (429)');
      }

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        throw new Error('Empty response');
      }

      return {
        text: text.trim(),
        fallbackUsed: model !== targetModel,
        actualModelUsed: model
      };
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError || new Error('Request failed');
}

async function queryOpenAICompatible(url, apiKey, model, systemInstruction, userMessage) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: 'system', content: systemInstruction },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.4,
      max_tokens: 1500
    })
  });

  if (response.status === 429) {
    throw new Error('Rate limit exceeded (429)');
  }

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    throw new Error(errJson.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error('Empty response');
  }

  return text.trim();
}

async function queryHuggingFace(apiKey, model, systemInstruction, userMessage) {
  const url = `https://api-inference.huggingface.co/models/${model}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      inputs: `<|system|>\n${systemInstruction}\n<|user|>\n${userMessage}\n<|assistant|>\n`,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.4,
        return_full_text: false
      }
    })
  });

  if (response.status === 429) {
    throw new Error('Rate limit exceeded (429)');
  }

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    throw new Error(errJson.error || `HTTP ${response.status}`);
  }

  const data = await response.json();
  const text = data[0]?.generated_text || data.generated_text;

  if (!text) {
    throw new Error('Empty response');
  }

  return text.trim();
}
