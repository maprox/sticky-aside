import react from '@astrojs/react'
import svelte from '@astrojs/svelte'
import vue from '@astrojs/vue'
import { defineConfig } from 'astro/config'
import { writeFileSync } from 'node:fs'

import { resolvePagesHost } from '#site/pages-host.mjs'

const { site, base, cname } = await resolvePagesHost()

if (cname && process.env.GITHUB_ACTIONS === 'true') {
  writeFileSync(new URL('./public/CNAME', import.meta.url), `${cname}\n`)
}

export default defineConfig({
  site,
  base,
  integrations: [vue(), react(), svelte()],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    server: {
      port: 4321,
    },
    ssr: {
      noExternal: ['@sticky-aside/core', '@sticky-aside/vue', '@sticky-aside/react', '@sticky-aside/svelte'],
    },
  },
})
