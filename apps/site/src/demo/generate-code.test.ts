import { describe, expect, it } from 'vitest'

import { generateDemoCode } from '#site/demo/generate-code.ts'
import { clampDemoSettings, DEFAULT_DEMO_SETTINGS } from '#site/demo/settings.ts'

const base = DEFAULT_DEMO_SETTINGS

describe('generateDemoCode', () => {
  it('prints vanilla knobs and skips viewportHeight and tall', () => {
    const code = generateDemoCode({
      ...base,
      top: 24,
      bottom: 8,
      viewportHeight: 500,
      tall: false,
    })
    expect(code).toContain("from '@sticky-aside/core'")
    expect(code).toContain("'--sticky-aside-top', '24px'")
    expect(code).toContain("'--sticky-aside-bottom', '8px'")
    expect(code).toContain('locked: false')
    expect(code).toContain('disabled: false')
    expect(code).toContain('<aside id="content">')
    expect(code).toContain('Shorter than the window. It stays at the top.')
    expect(code).toContain('A short panel stays at the top of the window. A tall one rides with the page until the edge you scroll toward meets the screen.')
    expect(code).toContain('<p>…</p>')
    expect(code).toContain("document.querySelector('#wrapper')")
    expect(code).not.toContain('<ol>')
    expect(code).not.toContain('500')
    expect(code).not.toContain('tall:')
  })

  it('shows the tall panel copy in the vanilla markup', () => {
    const code = generateDemoCode({ ...base, tall: true }, 'ru')
    expect(code).toContain('Панель выше окна. Крутите страницу в обе стороны.')
    expect(code).toContain('<ol>')
    expect(code).toContain('<li>…</li>')
  })

  it('prints vue kebab options', () => {
    const code = generateDemoCode({
      ...base,
      framework: 'vue',
      locked: true,
      allowLockedOverflowTop: true,
    })
    expect(code).toContain("from '@sticky-aside/vue'")
    expect(code).toContain(':locked="true"')
    expect(code).toContain(':allow-locked-overflow-top="true"')
    expect(code).toContain('as="aside"')
  })

  it('prints react style variables', () => {
    const code = generateDemoCode({
      ...base,
      framework: 'react',
      disabled: true,
      top: 64,
    })
    expect(code).toContain("from '@sticky-aside/react'")
    expect(code).toContain('disabled={true}')
    expect(code).toContain("'--sticky-aside-top': '64px'")
  })

  it('prints svelte style string', () => {
    const code = generateDemoCode({
      ...base,
      framework: 'svelte',
      bottom: 32,
    })
    expect(code).toContain("from '@sticky-aside/svelte'")
    expect(code).toContain('--sticky-aside-bottom: 32px')
  })

  it('prints solid camelCase options', () => {
    const code = generateDemoCode({
      ...base,
      framework: 'solid',
      locked: true,
      top: 40,
    })
    expect(code).toContain("from '@sticky-aside/solid'")
    expect(code).toContain('locked={true}')
    expect(code).toContain("'--sticky-aside-top': '40px'")
  })

  it('prints astro component usage', () => {
    const code = generateDemoCode({
      ...base,
      framework: 'astro',
      disabled: true,
      bottom: 24,
    })
    expect(code).toContain("from '@sticky-aside/astro'")
    expect(code).toContain('disabled={true}')
    expect(code).toContain('--sticky-aside-bottom: 24px')
  })
})

describe('clampDemoSettings', () => {
  it('clamps viewport and offsets', () => {
    const next = clampDemoSettings({ ...base, top: -4, viewportHeight: 80 })
    expect(next.top).toBe(0)
    expect(next.viewportHeight).toBe(240)
  })
})
