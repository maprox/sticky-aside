import { execSync } from 'node:child_process'
import { mkdirSync, readdirSync, renameSync, rmSync } from 'node:fs'

const packs = 'e2e/.packs'
rmSync(packs, { recursive: true, force: true })
mkdirSync(packs, { recursive: true })

execSync('pnpm build', { stdio: 'inherit' })

for (const name of ['@sticky-aside/core', '@sticky-aside/vue', '@sticky-aside/react', '@sticky-aside/svelte']) {
  execSync(`pnpm --filter ${name} pack --pack-destination ${packs}`, { stdio: 'inherit' })
  const prefix = `${name.replace('@', '').replace('/', '-')}-`
  const packed = readdirSync(packs).find((file) => file.startsWith(prefix) && file.endsWith('.tgz'))
  if (!packed) {
    throw new Error(`Missing tarball for ${name}`)
  }

  renameSync(`${packs}/${packed}`, `${packs}/${prefix.slice(0, -1)}.tgz`)
}

execSync('pnpm install --ignore-workspace', {
  cwd: 'e2e',
  stdio: 'inherit',
})

execSync('pnpm exec playwright test --config e2e/playwright.config.ts', {
  stdio: 'inherit',
})
