import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    https: false,  // HTTPSを無効化し、HTTPでサーバーを起動する
    proxy: {
      '/api': {
        target: 'https://api.microcms.io',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
