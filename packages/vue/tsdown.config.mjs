import { fileURLToPath } from 'node:url'
import { defineConfig } from 'tsdown'
import Vue from 'unplugin-vue/rolldown'

const cwd = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  cwd,
  entry: ['src/index.ts'],
  platform: 'browser',
  target: 'es2022',
  format: 'esm',
  dts: {
    vue: true,
  },
  minify: false,
  clean: true,
  hash: false,
  sourcemap: true,
  deps: {
    neverBundle: ['@sticky-aside/core', 'vue'],
  },
  plugins: [Vue({ isProduction: true })],
})
