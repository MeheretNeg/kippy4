import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['apexcharts', 'react-apexcharts', 'framer-motion', 'canvas-confetti'],
  },
  build: {
    commonjsOptions: {
      include: [/apexcharts/, /react-apexcharts/]
    }
  },
  server: {
    port: 5174,
    strictPort: true,
    host: true,
    open: false,
    watch: {
      usePolling: true,
    },
    hmr: {
      timeout: 60000
    }
  }
});
