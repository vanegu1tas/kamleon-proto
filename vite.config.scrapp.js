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
    rollupOptions: {
      // Dos entradas: la scrapp interna (explorations + flujos) y la demo del
      // recommendation engine, que se comparte con business por su propio link.
      input: {
        main: 'scrapp/index.html',
        recommendation: 'scrapp/recommendation.html',
      },
    },
  },
});
