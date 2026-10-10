import react from '@vitejs/plugin-react'
import vue from '@vitejs/plugin-vue'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    react(),
    svelte(),
  ],
  optimizeDeps: {
    exclude: ['@sticky-aside/svelte'],
  },
  server: {
    host: '127.0.0.1',
    port: 4174,
    strictPort: true,
  },
})
