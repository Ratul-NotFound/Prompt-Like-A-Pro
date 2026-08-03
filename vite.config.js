import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { runMultiProviderEnhance } from './api/enhanceLogic.js';

function localApiPlugin() {
  return {
    name: 'local-api-enhance-plugin',
    configureServer(server) {
      server.middlewares.use('/api/enhance', (req, res, next) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const env = loadEnv(server.config.mode || 'development', process.cwd(), '');
              const result = await runMultiProviderEnhance(parsed.rawPrompt, parsed.domain, parsed.model, env);
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 200;
              res.end(JSON.stringify(result));
            } catch (err) {
              console.error('Local Vite Proxy Error:', err.message);
              res.statusCode = 429;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          next();
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), localApiPlugin()],
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
