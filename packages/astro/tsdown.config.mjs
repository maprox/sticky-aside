import { fileURLToPath } from 'node:url'
import { defineConfig } from 'tsdown'

const cwd = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  cwd,
  entry: ['src/client.ts'],
  platform: 'browser',
  target: 'es2022',
  format: 'esm',
  dts: true,
  minify: false,
  clean: true,
  hash: false,
  sourcemap: true,
  deps: {
    neverBundle: ['@sticky-aside/core'],
  },
})
