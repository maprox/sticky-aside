import config from '@maprox/lint-config'

export default [
  {
    ignores: ['e2e/**', '**/.svelte-kit/**', 'packages/solid/jest-dom-stub.ts'],
  },
  ...config,
]
