import { execSync } from 'node:child_process'
import { mkdirSync, rmSync } from 'node:fs'

const packs = 'e2e/.packs'
rmSync(packs, { recursive: true, force: true })
mkdirSync(packs, { recursive: true })

execSync('pnpm build', { stdio: 'inherit' })

for (const name of ['@sticky-aside/core', '@sticky-aside/vue', '@sticky-aside/react', '@sticky-aside/svelte']) {
  execSync(`pnpm --filter ${name} pack --pack-destination e2e/.packs`, { stdio: 'inherit' })
}

execSync('pnpm install --ignore-workspace', {
  cwd: 'e2e',
  stdio: 'inherit',
})

execSync('pnpm exec playwright test --config e2e/playwright.config.ts', {
  stdio: 'inherit',
})
