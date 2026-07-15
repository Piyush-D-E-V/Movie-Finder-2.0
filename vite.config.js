import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss()
  ],
  server: {
    proxy: {
      '/api/tmdb': {
        target: 'https://api.themoviedb.org', // Yahan se /3 hata diya
        changeOrigin: true,
        secure: false, // Yeh extra line add ki hai
        rewrite: (path) => path.replace(/^\/api\/tmdb/, '/3') // Aur /3 yahan laga diya
      }
    }
  }
})