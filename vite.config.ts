import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Untuk GitHub Pages, base diisi otomatis oleh workflow:
//   VITE_BASE_PATH=/<nama-repository>/
// Saat pengembangan lokal, cukup '/'.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH ?? '/',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
