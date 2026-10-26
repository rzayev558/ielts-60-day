import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative asset paths so the build works under GitHub Pages' /ielts-60-day/ subpath and at a root domain.
  base: './',
});
