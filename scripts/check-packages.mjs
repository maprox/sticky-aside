import { execFileSync, spawnSync } from 'node:child_process'
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
  {
    name: '@sticky-aside/angular',
    dir: 'packages/angular',
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

    const tarballPath = join(destination, tarball)
    assertPublishedTypes(pkg.name, tarballPath)
    run('pnpm', ['exec', 'attw', tarballPath, '--profile', 'esm-only', ...pkg.attwArgs])

  }
} finally {
  rmSync(destination, { recursive: true, force: true })
}

function assertPublishedTypes(name, tarball) {
  const manifest = JSON.parse(execFileSync('tar', ['-xOzf', tarball, 'package/package.json'], { encoding: 'utf8' }))
  const types = manifest.types
  if (typeof types !== 'string' || !types.endsWith('.d.ts')) {
    throw new Error(`${name} published package.json has no root types field pointing at a .d.ts file`)
  }
  const packed = execFileSync('tar', ['-tzf', tarball], { encoding: 'utf8' })
  const entry = `package/${types.replace(/^\.\//, '')}`
  if (!packed.split('\n').includes(entry)) {
    throw new Error(`${name} types field ${types} is not in the tarball`)
  }
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
