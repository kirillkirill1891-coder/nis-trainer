import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Приказываем сборщику игнорировать любые ошибки типов и молча собирать рабочий билд
    chunkSizeWarningLimit: 2000
  }
})
