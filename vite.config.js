import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/who-is/' : '/',
  plugins: [react()],
  build: { rollupOptions: { input: { index: resolve(import.meta.dirname, 'app.html') } } },
})
