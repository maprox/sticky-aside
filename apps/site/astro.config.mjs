import react from '@astrojs/react'
import svelte from '@astrojs/svelte'
import vue from '@astrojs/vue'
import { defineConfig } from 'astro/config'

export default defineConfig({
  integrations: [vue(), react(), svelte()],
  vite: {
    server: {
      port: 4321,
    },
    ssr: {
      noExternal: ['@sticky-aside/core', '@sticky-aside/vue', '@sticky-aside/react', '@sticky-aside/svelte'],
    },
  },
})
