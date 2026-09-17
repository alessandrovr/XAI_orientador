import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// `base` precisa ser igual a /nome-do-repositorio/ no GitHub Pages.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/xai-orientador/',
})
