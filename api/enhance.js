/**
 * Prompt Like A Pro — Secure Backend Proxy & Key Rotation Serverless Function
 * Deploys on Vercel under `/api/enhance`
 * Features Multi-Provider Fallback Pooling (Gemini -> Groq -> OpenRouter -> HuggingFace)
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { rawPrompt, domain, model = 'gemini-1.5-pro' } = req.body;

  if (!rawPrompt || !rawPrompt.trim()) {
    return res.status(400).json({ error: 'Missing prompt content.' });
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

  const errors = [];

  // =========================================================================
  // PROVIDER 1: Google Gemini (Primary Pool)
  // =========================================================================
  const geminiKeys = parseKeys(process.env.GEMINI_KEYS || process.env.GEMINI_API_KEY);
  if (geminiKeys.length > 0) {
    console.log(`Trying Gemini Pool with ${geminiKeys.length} keys...`);
    for (let i = 0; i < geminiKeys.length; i++) {
      try {
        const result = await queryGemini(rawPrompt, domain, geminiKeys[i], model, systemInstruction, userMessage);
        return res.status(200).json({
          text: result.text,
          fallbackUsed: result.fallbackUsed,
          actualModelUsed: result.actualModelUsed,
          providerUsed: 'Gemini AI'
        });
      } catch (err) {
        console.warn(`Gemini key index ${i} failed: ${err.message}`);
        errors.push(`Gemini Key ${i}: ${err.message}`);
      }
    }
  }

  // =========================================================================
  // PROVIDER 2: Groq API (Secondary Pool - Free Tier)
  // =========================================================================
  const groqKeys = parseKeys(process.env.GROQ_KEYS || process.env.GROQ_API_KEY);
  if (groqKeys.length > 0) {
    console.log(`Trying Groq Pool with ${groqKeys.length} keys...`);
    const groqModel = 'llama3-8b-8192'; // High performance free model
    for (let i = 0; i < groqKeys.length; i++) {
      try {
        const resultText = await queryOpenAICompatible(
          'https://api.groq.com/openai/v1/chat/completions',
          groqKeys[i],
          groqModel,
          systemInstruction,
          userMessage
        );
        return res.status(200).json({
          text: resultText,
          fallbackUsed: true,
          actualModelUsed: `Llama 3 8B via Groq`,
          providerUsed: 'Groq Cloud'
        });
      } catch (err) {
        console.warn(`Groq key index ${i} failed: ${err.message}`);
        errors.push(`Groq Key ${i}: ${err.message}`);
      }
    }
  }

  // =========================================================================
  // PROVIDER 3: OpenRouter Free Models (Tertiary Pool)
  // =========================================================================
  const openrouterKeys = parseKeys(process.env.OPENROUTER_KEYS || process.env.OPENROUTER_API_KEY);
  if (openrouterKeys.length > 0) {
    console.log(`Trying OpenRouter Pool with ${openrouterKeys.length} keys...`);
    const freeModels = [
      'meta-llama/llama-3-8b-instruct:free',
      'google/gemma-2-9b-it:free'
    ];
    for (let i = 0; i < openrouterKeys.length; i++) {
      for (const openrouterModel of freeModels) {
        try {
          const resultText = await queryOpenAICompatible(
            'https://openrouter.ai/api/v1/chat/completions',
            openrouterKeys[i],
            openrouterModel,
            systemInstruction,
            userMessage
          );
          return res.status(200).json({
            text: resultText,
            fallbackUsed: true,
            actualModelUsed: `${openrouterModel.split('/')[1]} (Free)`,
            providerUsed: 'OpenRouter'
          });
        } catch (err) {
          console.warn(`OpenRouter key index ${i} model ${openrouterModel} failed: ${err.message}`);
          errors.push(`OpenRouter Key ${i} (${openrouterModel}): ${err.message}`);
        }
      }
    }
  }

  // =========================================================================
  // PROVIDER 4: Hugging Face Serverless API (Quaternary Pool)
  // =========================================================================
  const hfKeys = parseKeys(process.env.HF_KEYS || process.env.HF_API_KEY);
  if (hfKeys.length > 0) {
    console.log(`Trying Hugging Face Pool with ${hfKeys.length} keys...`);
    const hfModel = 'meta-llama/Meta-Llama-3-8B-Instruct';
    for (let i = 0; i < hfKeys.length; i++) {
      try {
        const resultText = await queryHuggingFace(hfKeys[i], hfModel, systemInstruction, userMessage);
        return res.status(200).json({
          text: resultText,
          fallbackUsed: true,
          actualModelUsed: 'Llama 3 8B via HuggingFace',
          providerUsed: 'HuggingFace'
        });
      } catch (err) {
        console.warn(`Hugging Face key index ${i} failed: ${err.message}`);
        errors.push(`HuggingFace Key ${i}: ${err.message}`);
      }
    }
  }

  // All providers failed
  return res.status(429).json({
    error: 'All free tier API providers in the rotation pool have been exhausted.',
    details: errors
  });
}

// Helpers
function parseKeys(envValue) {
  if (!envValue) return [];
  return envValue.split(',').map(k => k.trim()).filter(Boolean);
}

async function queryGemini(rawPrompt, domain, apiKey, targetModel, systemInstruction, userMessage) {
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
  // HuggingFace returns an array of result objects
  const text = data[0]?.generated_text || data.generated_text;

  if (!text) {
    throw new Error('Empty response');
  }

  return text.trim();
}
