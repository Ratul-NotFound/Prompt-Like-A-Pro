/**
 * Prompt Like A Pro — Secure Backend Proxy & Key Rotation Serverless Function
 * Deploys on Vercel under `/api/enhance`
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { rawPrompt, domain, model = 'gemini-1.5-pro' } = req.body;

  if (!rawPrompt || !rawPrompt.trim()) {
    return res.status(400).json({ error: 'Missing prompt content.' });
  }

  // Load API keys pool from Vercel Environment Variables
  // Support comma-separated keys: GEMINI_KEYS="key1,key2,key3"
  const keysString = process.env.GEMINI_KEYS || process.env.GEMINI_API_KEY || '';
  const keyPool = keysString
    .split(',')
    .map(k => k.trim())
    .filter(Boolean);

  if (keyPool.length === 0) {
    return res.status(500).json({ 
      error: 'Backend API key pool is empty. Please configure GEMINI_KEYS on Vercel.' 
    });
  }

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

  // Cycle through the key pool to handle rate limits and exhaustion
  let lastError = null;

  for (let i = 0; i < keyPool.length; i++) {
    const currentKey = keyPool[i];
    
    try {
      const responseText = await queryGeminiWithFallback(
        rawPrompt, 
        domain, 
        currentKey, 
        model, 
        systemInstruction, 
        userMessage
      );

      return res.status(200).json(responseText);
    } catch (err) {
      console.warn(`Key Index ${i} failed. Reason: ${err.message}. Trying next key...`);
      lastError = err;
    }
  }

  // If we reach here, all keys in the pool have failed
  return res.status(429).json({ 
    error: `All API keys in rotation pool exhausted. Details: ${lastError?.message || 'Rate limit exceeded'}` 
  });
}

// Internal query function with model fallback (Pro -> Flash)
async function queryGeminiWithFallback(rawPrompt, domain, apiKey, targetModel, systemInstruction, userMessage) {
  const modelsToTry = targetModel === 'gemini-1.5-pro' 
    ? ['gemini-1.5-pro', 'gemini-1.5-flash'] 
    : ['gemini-1.5-flash'];

  let lastError = null;

  for (const model of modelsToTry) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

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
      console.warn(`Model ${model} failed on this key. Reason: ${err.message}`);
      lastError = err;
    }
  }

  throw lastError || new Error('Request failed');
}
