// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://192.168.0.7:3000',
        changeOrigin: true,
        secure: false, 
        host: '0.0.0.0',
        port: 5173,
        // rewrite: (path) => path.replace(/^\/api/, '')  //NO usar esta línea
      }
    }
  }  
})
