import angular from '@analogjs/vite-plugin-angular'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import react from '@vitejs/plugin-react'
import vue from '@vitejs/plugin-vue'
import solid from 'vite-plugin-solid'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'core',
          environment: 'happy-dom',
          include: ['packages/core/src/**/*.test.ts'],
        },
      },
      {
        plugins: [vue()],
        test: {
          name: 'vue',
          environment: 'happy-dom',
          include: ['packages/vue/src/**/*.test.ts'],
        },
      },
      {
        plugins: [react()],
        test: {
          name: 'react',
          environment: 'happy-dom',
          include: ['packages/react/src/**/*.test.tsx'],
        },
      },
      {
        plugins: [solid()],
        resolve: {
          conditions: ['browser', 'development'],
        },
        test: {
          name: 'solid',
          environment: 'happy-dom',
          setupFiles: ['packages/solid/jest-dom-stub.ts'],
          include: ['packages/solid/src/**/*.test.tsx'],
          testNamePattern: /^(?!.*renders on the server without touching the window)/,
          server: {
            deps: {
              inline: ['solid-js', 'solid-js/web', '@solidjs/testing-library'],
            },
          },
        },
      },
      {
        plugins: [solid({ ssr: true })],
        test: {
          name: 'solid-ssr',
          environment: 'node',
          setupFiles: ['packages/solid/jest-dom-stub.ts'],
          include: ['packages/solid/src/**/*.test.tsx'],
          testNamePattern: /renders on the server without touching the window/,
        },
      },
      {
        plugins: [svelte({
          configFile: 'packages/svelte/svelte.config.js',
        })],
        resolve: {
          conditions: ['browser'],
        },
        test: {
          name: 'svelte',
          environment: 'happy-dom',
          include: ['packages/svelte/src/**/*.test.ts'],
          exclude: ['packages/svelte/src/**/*.ssr.test.ts'],
        },
      },
      {
        plugins: [svelte({
          configFile: 'packages/svelte/svelte.config.js',
        })],
        test: {
          name: 'svelte-ssr',
          environment: 'node',
          include: ['packages/svelte/src/**/*.ssr.test.ts'],
        },
      },
      {
        root: 'packages/angular',
        plugins: [
          angular({ tsconfig: 'packages/angular/tsconfig.spec.json' }),
        ],
        test: {
          name: 'angular',
          environment: 'happy-dom',
          include: ['src/**/*.test.ts'],
          setupFiles: ['vitest-setup.ts'],
        },
      },
      {
        test: {
          name: 'astro',
          environment: 'happy-dom',
          include: ['packages/astro/src/**/*.test.ts'],
        },
      },
      {
        test: {
          name: 'site',
          environment: 'happy-dom',
          include: ['apps/site/src/**/*.test.ts'],
        },
      },
    ],
  },
})
