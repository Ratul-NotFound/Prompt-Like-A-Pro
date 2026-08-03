/**
 * Prompt Like A Pro — Optional Live Gemini Meta-Prompt API Client
 * Uses Google Gemini REST API or secure Serverless Backend Proxy (/api/enhance)
 * with built-in Key Rotation Pool and Model Version Fallback.
 */

const GEMINI_MODEL_FALLBACKS = [
  'gemini-2.5-pro',
  'gemini-2.5-flash',
  'gemini-2.0-flash'
];

export async function enhancePromptWithGemini(rawPrompt, domain, apiKey, model = 'gemini-2.5-pro') {
  // If an API key is provided directly in the browser (Settings override), call Google directly
  if (apiKey && apiKey.trim()) {
    return await queryGoogleDirectly(rawPrompt, domain, apiKey, model);
  }

  // Otherwise, route through the secure Vercel Serverless Proxy endpoint (keeps keys hidden)
  try {
    const response = await fetch('/api/enhance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        rawPrompt,
        domain,
        model
      })
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

// Direct client-side Google API call with automated cascading model fallback
async function queryGoogleDirectly(rawPrompt, domain, apiKey, targetModel) {
  const startIndex = Math.max(0, GEMINI_MODEL_FALLBACKS.indexOf(targetModel));
  const modelsToTry = GEMINI_MODEL_FALLBACKS.slice(startIndex);

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

  let lastError = null;

  for (const activeModel of modelsToTry) {
    const url = `https://generativelanguage.googleapis.com/v1/models/${activeModel}:generateContent?key=${apiKey.trim()}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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

      if (response.status === 404 || response.status === 429 || response.status === 400) {
        console.warn(`Model ${activeModel} failed (HTTP ${response.status}). Cascading to next model...`);
        lastError = new Error(`HTTP ${response.status}`);
        continue;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `Gemini API Error: ${response.status}`);
      }

      const data = await response.json();
      const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!resultText) {
        throw new Error('Empty response.');
      }

      return {
        text: resultText.trim(),
        fallbackUsed: activeModel !== targetModel,
        actualModelUsed: activeModel,
        providerUsed: 'Gemini AI'
      };
    } catch (err) {
      console.warn(`Catch block triggered for ${activeModel}: ${err.message}. Cascading...`);
      lastError = err;
      continue;
    }
  }

  throw lastError || new Error('All fallback models exhausted.');
}
