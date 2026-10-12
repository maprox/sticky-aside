import { describe, expect, it } from 'vitest'

import { hreflangLinks, pageHref, seoCopy } from '#site/demo/seo.ts'

const origin = 'https://maprox.github.io'
const base = '/sticky-aside/'

describe('seoCopy', () => {
  it('keeps framework-specific English titles and descriptions', () => {
    expect(seoCopy('en', 'vanilla').title).toBe('JavaScript sticky sidebar library — sticky-aside')
    expect(seoCopy('en', 'vue').title).toBe('Vue sticky sidebar for Vue 3 — sticky-aside')
    expect(seoCopy('en', 'react').title).toBe('React sticky sidebar — sticky-aside')
    expect(seoCopy('en', 'svelte').title).toBe('Svelte sticky sidebar — sticky-aside')
    expect(seoCopy('en', 'solid').title).toBe('Solid sticky sidebar — sticky-aside')
    expect(seoCopy('en', 'astro').title).toBe('Astro sticky sidebar — sticky-aside')

    expect(seoCopy('en', 'vue').description).toMatch(/Modern browsers only/)
    expect(seoCopy('en', 'vanilla').description).toMatch(/no legacy path/)
    expect(seoCopy('en', 'react').description).toMatch(/no legacy polyfills/)
    expect(seoCopy('en', 'svelte').description).toMatch(/no legacy support tax/)
    expect(seoCopy('en', 'solid').description).toBe(
      'Solid sticky sidebar adapter over a tiny modern core. Both-edge pin, lock, CSS offsets. Current browsers only.',
    )
    expect(seoCopy('en', 'astro').description).toBe(
      'Sticky sidebar for Astro with the same createStickyAside API as vanilla. Both-edge pin, lock, CSS offsets. Small ESM core for modern browsers.',
    )
  })

  it('mirrors Russian titles and keeps English head terms', () => {
    expect(seoCopy('ru', 'vanilla').title).toBe('JavaScript sticky sidebar — библиотека sticky-aside')
    expect(seoCopy('ru', 'vue').title).toBe('Vue sticky sidebar для Vue 3 — sticky-aside')
    expect(seoCopy('ru', 'react').title).toBe('React sticky sidebar — sticky-aside')
    expect(seoCopy('ru', 'svelte').title).toBe('Svelte sticky sidebar — sticky-aside')
    expect(seoCopy('ru', 'solid').title).toBe('Solid sticky sidebar — sticky-aside')
    expect(seoCopy('ru', 'astro').title).toBe('Astro sticky sidebar — sticky-aside')

    expect(seoCopy('ru', 'vue').description).toMatch(/современные браузеры/i)
    expect(seoCopy('ru', 'vanilla').description).toMatch(/без legacy/)
  })
})

describe('pageHref', () => {
  it('builds absolute GitHub Pages URLs with a trailing slash', () => {
    expect(pageHref(origin, 'en', 'vanilla', base)).toBe('https://maprox.github.io/sticky-aside/')
    expect(pageHref(origin, 'en', 'react', base)).toBe('https://maprox.github.io/sticky-aside/react/')
    expect(pageHref(origin, 'en', 'solid', base)).toBe('https://maprox.github.io/sticky-aside/solid/')
    expect(pageHref(origin, 'en', 'astro', base)).toBe('https://maprox.github.io/sticky-aside/astro/')
    expect(pageHref(origin, 'ru', 'vue', base)).toBe('https://maprox.github.io/sticky-aside/ru/vue/')
    expect(pageHref(origin, 'ru', 'solid', base)).toBe('https://maprox.github.io/sticky-aside/ru/solid/')
    expect(pageHref(origin, 'ru', 'vanilla', base)).toBe('https://maprox.github.io/sticky-aside/ru/')
  })
})

describe('hreflangLinks', () => {
  it('emits en, ru, and x-default for the same framework', () => {
    expect(hreflangLinks(origin, 'react', base)).toEqual([
      { hreflang: 'en', href: 'https://maprox.github.io/sticky-aside/react/' },
      { hreflang: 'ru', href: 'https://maprox.github.io/sticky-aside/ru/react/' },
      { hreflang: 'x-default', href: 'https://maprox.github.io/sticky-aside/react/' },
    ])
    expect(hreflangLinks(origin, 'astro', base)).toEqual([
      { hreflang: 'en', href: 'https://maprox.github.io/sticky-aside/astro/' },
      { hreflang: 'ru', href: 'https://maprox.github.io/sticky-aside/ru/astro/' },
      { hreflang: 'x-default', href: 'https://maprox.github.io/sticky-aside/astro/' },
    ])
  })
})
