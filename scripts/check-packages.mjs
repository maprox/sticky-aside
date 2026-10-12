import { spawnSync } from 'node:child_process'
import { mkdtempSync, readdirSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const packages = [
  {
    name: '@sticky-aside/core',
    dir: 'packages/core',
    attwArgs: ['--exclude-entrypoints', './offsets.css'],
  },
  {
    name: '@sticky-aside/vue',
    dir: 'packages/vue',
    attwArgs: [],
  },
  {
    name: '@sticky-aside/react',
    dir: 'packages/react',
    attwArgs: [],
  },
  {
    name: '@sticky-aside/svelte',
    dir: 'packages/svelte',
    attwArgs: [],
  },
  {
    name: '@sticky-aside/solid',
    dir: 'packages/solid',
    attwArgs: [],
  },
  {
    name: '@sticky-aside/astro',
    dir: 'packages/astro',
    attwArgs: [],
  },
]

const destination = mkdtempSync(join(tmpdir(), 'sticky-aside-pack-'))

try {
  for (const pkg of packages) {
    run('pnpm', ['exec', 'publint', 'run', '--pack', 'pnpm', pkg.dir])
    const before = new Set(readdirSync(destination))
    run('pnpm', ['--filter', pkg.name, 'pack', '--pack-destination', destination])
    const tarball = readdirSync(destination).find((file) => !before.has(file))
    if (!tarball) {
      throw new Error(`pnpm pack did not write a tarball for ${pkg.name}`)
    }

    run('pnpm', ['exec', 'attw', join(destination, tarball), '--profile', 'esm-only', ...pkg.attwArgs])

  }
} finally {
  rmSync(destination, { recursive: true, force: true })
}

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: true,
  })
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}
