import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // to avoid "process" is not defined error in excalidraw
    'process.env': {},
  },
  resolve: {
    alias: {
      '@': ''
    },
    external: ['web-worker'],
  }
})
