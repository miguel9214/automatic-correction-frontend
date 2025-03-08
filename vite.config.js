import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // ✅ Importa 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // ✅ Configura '@' para que apunte a 'src'
    },
  },
})
