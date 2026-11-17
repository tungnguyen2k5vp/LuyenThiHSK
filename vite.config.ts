import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: { entries: ['index.html'] },
  server: {
    fs: {deny:['.env','.env.*','*.{crt,pem}','**/.git/**','**/.runtime/**','**/data/staging/**','**/data/raw/**','**/data/editorial/**','**/data/reports/**','**/data/review-packages/**']},
    port: 3000,
    open: false,
    proxy: { '/api/account': 'http://127.0.0.1:8788', '/api': 'http://127.0.0.1:8787' },
  },
  preview: { proxy: { '/api/account': 'http://127.0.0.1:8788', '/api': 'http://127.0.0.1:8787' } },
});
