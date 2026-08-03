# Free AI API Keys Configuration Guide

To power your **Prompt Like A Pro** deployment with multiple free AI providers, follow these direct links to register and get your free API keys:

---

### 1. 🌐 Google Gemini API Key
*   **Provider**: Google AI Studio
*   **Direct Link**: [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
*   **Free Limits**: 1,500 requests/day (Gemini 1.5 Flash), 50 requests/day (Gemini 1.5 Pro).
*   **Environment Variable**: `GEMINI_KEYS`

---

### 2. ⚡ Groq Cloud API Key
*   **Provider**: Groq Developer Console
*   **Direct Link**: [console.groq.com/keys](https://console.groq.com/keys)
*   **Free Limits**: Generous free token-per-minute (TPM) limits on Llama 3 8B.
*   **Environment Variable**: `GROQ_KEYS`

---

### 3. 🪙 OpenRouter API Key
*   **Provider**: OpenRouter Dashboard
*   **Direct Link**: [openrouter.ai/keys](https://openrouter.ai/keys)
*   **Free Limits**: Unlimited free models (like Llama 3 8B Instruct Free and Gemma 2 9B Free).
*   **Environment Variable**: `OPENROUTER_KEYS`

---

### 4. 🤗 Hugging Face API Token
*   **Provider**: Hugging Face Access Tokens Settings
*   **Direct Link**: [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
*   **Free Limits**: Free Serverless Inference API access to Llama 3 8B and Mistral 7B.
*   **Environment Variable**: `HF_KEYS` (Generate a token with `Read` role).

---

## 🛠️ Vercel Environment Variables setup
When deploying to Vercel, navigate to **Settings -> Environment Variables** and add:
```env
GEMINI_KEYS=your_gemini_key_1,your_gemini_key_2
GROQ_KEYS=your_groq_key
OPENROUTER_KEYS=your_openrouter_key
HF_KEYS=your_huggingface_token
```
*(You can comma-separate multiple keys to enable automated Key Rotation).*
