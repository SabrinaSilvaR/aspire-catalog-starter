import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
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
