import config from '@maprox/lint-config'

export default [
  {
    ignores: [
      'e2e/**',
      '.worktrees/**',
      '**/.svelte-kit/**',
      'packages/solid/jest-dom-stub.ts',
      'packages/angular/dist/**',
    ],
  },
  ...config,
  {
    files: ['packages/angular/src/public-api.ts'],
    rules: {
      'no-restricted-imports': 'off',
    },
  },
  {
    files: [
      'packages/angular/src/**/*.test.ts',
      'packages/angular/vitest-setup.ts',
    ],
    languageOptions: {
      parserOptions: {
        project: './packages/angular/tsconfig.spec.json',
      },
    },
    rules: {
      'no-restricted-imports': 'off',
    },
  },
]
