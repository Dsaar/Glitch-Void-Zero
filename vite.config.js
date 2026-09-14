import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import leaderboardHandler from './api/leaderboard.js';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'MONGODB_');
  for (const [key, value] of Object.entries(env)) {
    process.env[key] ??= value;
  }
  const installApi = (server) => {
    server.middlewares.use((req, res, next) => {
      if (req.url?.split('?')[0] === '/api/leaderboard') {
        return leaderboardHandler(req, res);
      }
      next();
    });
  };
  return {
    plugins: [react(), {
      name: 'leaderboard-api',
      configureServer: installApi,
      configurePreviewServer: installApi,
    }],
  };
});
