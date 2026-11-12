import react from '@astrojs/react'
import svelte from '@astrojs/svelte'
import vue from '@astrojs/vue'
import { defineConfig } from 'astro/config'
import { readFileSync } from 'node:fs'

import { resolvePagesHost } from '#site/pages-host.mjs'

function readCname() {
  try {
    return readFileSync(new URL('./public/CNAME', import.meta.url), 'utf8')
  } catch {
    return ''
  }
}

const { site, base } = await resolvePagesHost(process.env, globalThis.fetch, readCname())

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
