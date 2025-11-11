import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  base: '/lumin-venturus/',
  plugins: [tailwindcss()],
  root: './src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/index.html'),
        about: path.resolve(__dirname, 'src/about-us/index.html'),
        contact: path.resolve(__dirname, 'src/contact-us/index.html'),
        dashboard: path.resolve(__dirname, 'src/dashboard/index.html'),
        ai: path.resolve(__dirname, 'src/dashboard/ai/index.html'),
        calendar: path.resolve(__dirname, 'src/dashboard/calendar/index.html'),
        features: path.resolve(__dirname, 'src/features/index.html'),
        login: path.resolve(__dirname, 'src/login/index.html'),
        register: path.resolve(__dirname, 'src/register/index.html'),
      },
    },
  },
  publicDir: '../public',
  envDir: '../',
})
