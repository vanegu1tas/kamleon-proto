import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'scrapp',
  plugins: [react()],
  server: {
    port: 5174,
  },
  build: {
    outDir: '../gh-pages/scrapp',
    emptyOutDir: true,
  },
});
