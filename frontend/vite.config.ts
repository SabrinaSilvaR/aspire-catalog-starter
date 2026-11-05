import path from 'node:path'
import react from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    UnoCSS(),
    react(),
  ],
  resolve: {
    alias: {
      '#libs': path.resolve(import.meta.dirname, './src/libs'),
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    port: parseInt(process.env.PORT || '5173'),
    proxy: {
      '/api': {
        target: process.env.services__backend_api__http__0 || 'http://localhost:5100',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
