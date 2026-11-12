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
    expect(base).toMatch(/favicon-48\.png/)
    expect(base).toMatch(/sizes=["']48x48["']/)
    expect(base).toMatch(/favicon\.ico/)
    expect(base).not.toMatch(/fonts\.googleapis\.com/)
    expect(base).not.toMatch(/fonts\.gstatic\.com/)
  })

  it('ships a 48px PNG and an ICO whose shapes do not depend on CSS', () => {
    const png = readFileSync(join(siteRoot, 'public/favicon-48.png'))
    expect(png.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a')
    expect(png.readUInt32BE(16)).toBe(48)
    expect(png.readUInt32BE(20)).toBe(48)

    const ico = readFileSync(join(siteRoot, 'public/favicon.ico'))
    expect(ico.readUInt16LE(0)).toBe(0)
    expect(ico.readUInt16LE(2)).toBe(1)
    expect(ico.readUInt16LE(4)).toBeGreaterThan(0)

    const svg = readFileSync(join(siteRoot, 'public/favicon.svg'), 'utf8')
    expect(svg).toMatch(/fill="#d5e2e8"/)
    expect(svg).toMatch(/fill="#142229"/)
  })

  it('emits SEO description, canonical, hreflang, and Open Graph tags', () => {
    const base = readFileSync(join(siteRoot, 'src/layouts/Base.astro'), 'utf8')
    expect(base).toMatch(/seoCopy/)
    expect(base).toMatch(/name="description"/)
    expect(base).toMatch(/rel="canonical"/)
    expect(base).toMatch(/hreflang/)
    expect(base).toMatch(/property="og:title"/)
    expect(base).toMatch(/property="og:description"/)
    expect(base).toMatch(/property="og:url"/)
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

  it('SSGs the demo viewport and framework snippet before client JS', () => {
    const variant = readFileSync(join(siteRoot, 'src/components/VariantPage.astro'), 'utf8')
    expect(variant).toMatch(/initialSnippetText/)
    expect(variant).toMatch(/initialSnippetText\(locale,\s*framework\)/)
    expect(variant).toMatch(/data-scrub-host/)
    expect(variant).not.toMatch(/data-scrub-host><\/div>/)

    const mini = readFileSync(join(siteRoot, 'src/components/MiniWindow.astro'), 'utf8')
    expect(mini).toMatch(/initialViewportModel/)
    expect(mini).toMatch(/mini-page/)
    expect(mini).toMatch(/panel-copy/)
  })

  it('runs eslint in pre-commit before typecheck', () => {
    const pkg = JSON.parse(readFileSync(join(siteRoot, '../../package.json'), 'utf8')) as {
      'simple-git-hooks'?: { 'pre-commit'?: string }
    }
    const preCommit = pkg['simple-git-hooks']?.['pre-commit'] ?? ''
    expect(preCommit).toMatch(/\blint\b/)
    expect(preCommit).toMatch(/\btypecheck\b/)
    expect(preCommit.indexOf('lint')).toBeLessThan(preCommit.indexOf('typecheck'))
  })
})
