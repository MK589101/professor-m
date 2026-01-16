import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 👇 這一行就是修復空白畫面的關鍵解藥
  define: {
    'process.env': {}
  }
})
