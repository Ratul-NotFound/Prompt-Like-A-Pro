import { runMultiProviderEnhance } from './enhanceLogic.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { rawPrompt, domain, model } = req.body || {};

  if (!rawPrompt || !domain) {
    return res.status(400).json({ error: 'Missing rawPrompt or domain in request body.' });
  }

  try {
    const result = await runMultiProviderEnhance(rawPrompt, domain, model, process.env);
    return res.status(200).json(result);
  } catch (err) {
    console.error('All providers failed in Vercel function:', err);
    return res.status(429).json({
      error: err.message
    });
  }
}
