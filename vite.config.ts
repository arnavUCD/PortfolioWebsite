import { defineConfig } from 'vite';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

// The site is served from https://arnavucd.github.io/PortfolioWebsite/, so
// production assets need the repo name as their base. Dev stays at the root.
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/PortfolioWebsite/' : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/app')
    }
  }
}));
