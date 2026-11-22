import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const { API_TARGET = 'http://127.0.0.1:3000' } = loadEnv(mode, '.', 'API_')
  const proxy = {
    '/api': {
      target: API_TARGET,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  }
  return { plugins: [react(), tailwindcss()], server: { proxy }, preview: { proxy } }
})
