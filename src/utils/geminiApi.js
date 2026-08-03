/**
 * Prompt Like A Pro — Optional Live Gemini Meta-Prompt API Client
 * Uses Google Gemini REST API to perform live AI-to-AI prompt engineering.
 * Defaults to gemini-1.5-pro for deep reasoning and intent analysis.
 */

export async function enhancePromptWithGemini(rawPrompt, domain, apiKey, model = 'gemini-1.5-pro') {
  if (!apiKey || !apiKey.trim()) {
    throw new Error('Gemini API Key is missing. Please provide a valid key in Settings.');
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

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey.trim()}`;

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
            parts: [
              { text: systemInstruction + '\n\n' + userMessage }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 2000
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Gemini API HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!resultText) {
      throw new Error('Received an empty response from Gemini API.');
    }

    return resultText.trim();
  } catch (err) {
    console.error('Gemini API Enhancement Error:', err);
    throw err;
  }
}
