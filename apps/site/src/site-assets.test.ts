import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const siteRoot = join(dirname(fileURLToPath(import.meta.url)), '..')

describe('site assets', () => {
  it('ships an SVG favicon under public/', () => {
    expect(existsSync(join(siteRoot, 'public/favicon.svg'))).toBe(true)
  })

  it('links the favicon and does not load Google Fonts', () => {
    const base = readFileSync(join(siteRoot, 'src/layouts/Base.astro'), 'utf8')
    expect(base).toMatch(/rel=["']icon["']/)
    expect(base).toMatch(/favicon\.svg/)
    expect(base).not.toMatch(/fonts\.googleapis\.com/)
    expect(base).not.toMatch(/fonts\.gstatic\.com/)
  })

  it('uses system font stacks instead of webfonts', () => {
    const css = readFileSync(join(siteRoot, 'src/styles/site.css'), 'utf8')
    expect(css).toMatch(/--font-body:\s*system-ui/)
    expect(css).toMatch(/--font-display:\s*system-ui/)
    expect(css).toMatch(/--font-mono:\s*ui-monospace/)
    expect(css).not.toMatch(/Syne|Literata|IBM Plex/)

    const variant = readFileSync(join(siteRoot, 'src/components/VariantPage.astro'), 'utf8')
    expect(variant).not.toMatch(/IBM Plex/)
  })
})
