import { fileURLToPath } from 'node:url'
import { defineConfig } from 'tsdown'
import solid from 'vite-plugin-solid'

const cwd = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  cwd,
  entry: ['src/StickyAside.tsx'],
  platform: 'browser',
  target: 'es2022',
  format: 'esm',
  dts: true,
  minify: false,
  clean: true,
  hash: false,
  sourcemap: true,
  deps: {
    neverBundle: ['@sticky-aside/core', 'solid-js', 'solid-js/web'],
  },
  plugins: [solid({ ssr: true, isProduction: true })],
})
