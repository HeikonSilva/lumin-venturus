import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/lumin-venturus/',
  plugins: [tailwindcss()],
  root: 'src',
})
