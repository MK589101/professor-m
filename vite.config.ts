import path from 'path';
iimport { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 👇 請加入下面這段 "define" 設定，這就是解藥！
  define: {
    'process.env': {}
  }
}),
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
