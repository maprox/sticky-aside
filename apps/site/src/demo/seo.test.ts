import { describe, expect, it } from 'vitest'

import {
  hreflangLinks,
  pageHref,
  renderRobotsTxt,
  renderSitemapXml,
  seoCopy,
  sitemapUrls,
} from '#site/demo/seo.ts'
import { DEMO_FRAMEWORKS } from '#site/demo/settings.ts'

const origin = 'https://docs.example'
const base = '/'

describe('seoCopy', () => {
  it.each(['en', 'ru'] as const)('writes concise, framework-specific snippets in %s', (locale) => {
    const headings: string[] = []
    const descriptions: string[] = []

    for (const framework of DEMO_FRAMEWORKS) {
      const copy = seoCopy(locale, framework)
      headings.push(copy.h1)
      descriptions.push(copy.description)

      expect(copy.title.length).toBeLessThanOrEqual(65)
      expect(copy.description.length).toBeGreaterThanOrEqual(120)
      expect(copy.description.length).toBeLessThanOrEqual(160)
      expect(copy.description).toMatch(/sticky/i)
    }

    expect(new Set(headings).size).toBe(DEMO_FRAMEWORKS.length)
    expect(new Set(descriptions).size).toBe(DEMO_FRAMEWORKS.length)
  })

  it('includes every adapter on the English homepage', () => {
    const description = seoCopy('en', 'vanilla').description

    expect(description).toContain('Angular')
    expect(description).toContain('Astro')
  })

  it('uses natural Russian terminology without untranslated UI jargon', () => {
    for (const framework of DEMO_FRAMEWORKS) {
      const copy = seoCopy('ru', framework)

      expect(copy.description).not.toMatch(/пин|legacy|\block\b/i)
      expect(copy.description).toMatch(/sticky/i)
    }
    expect(seoCopy('ru', 'vanilla').h1).toContain('прилипающая боковая панель')
  })
})

describe('pageHref', () => {
  it('builds absolute site URLs with a trailing slash', () => {
    expect(pageHref(origin, 'en', 'vanilla', base)).toBe('https://docs.example/')
    expect(pageHref(origin, 'en', 'react', base)).toBe('https://docs.example/react/')
    expect(pageHref(origin, 'en', 'solid', base)).toBe('https://docs.example/solid/')
    expect(pageHref(origin, 'en', 'astro', base)).toBe('https://docs.example/astro/')
    expect(pageHref(origin, 'en', 'angular', base)).toBe('https://docs.example/angular/')
    expect(pageHref(origin, 'ru', 'vue', base)).toBe('https://docs.example/ru/vue/')
    expect(pageHref(origin, 'ru', 'angular', base)).toBe('https://docs.example/ru/angular/')
    expect(pageHref(origin, 'ru', 'solid', base)).toBe('https://docs.example/ru/solid/')
    expect(pageHref(origin, 'ru', 'vanilla', base)).toBe('https://docs.example/ru/')
    expect(pageHref(origin, 'en', 'react', '/sticky-aside/')).toBe('https://docs.example/sticky-aside/react/')
  })
})

describe('hreflangLinks', () => {
  it('emits en, ru, and x-default for the same framework', () => {
    expect(hreflangLinks(origin, 'react', base)).toEqual([
      { hreflang: 'en', href: 'https://docs.example/react/' },
      { hreflang: 'ru', href: 'https://docs.example/ru/react/' },
      { hreflang: 'x-default', href: 'https://docs.example/react/' },
    ])
    expect(hreflangLinks(origin, 'astro', base)).toEqual([
      { hreflang: 'en', href: 'https://docs.example/astro/' },
      { hreflang: 'ru', href: 'https://docs.example/ru/astro/' },
      { hreflang: 'x-default', href: 'https://docs.example/astro/' },
    ])
  })
})

describe('sitemapUrls', () => {
  it('lists every locale × framework demo URL', () => {
    const urls = sitemapUrls(origin, base)
    expect(urls).toHaveLength(14)
    expect(urls[0]).toBe('https://docs.example/')
    expect(urls).toContain('https://docs.example/react/')
    expect(urls).toContain('https://docs.example/ru/')
    expect(urls).toContain('https://docs.example/ru/angular/')
  })
})

describe('renderSitemapXml', () => {
  it('wraps locs in a urlset', () => {
    const xml = renderSitemapXml(['https://docs.example/'])
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(xml).toContain('<loc>https://docs.example/</loc>')
    expect(xml).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')
  })
})

describe('renderRobotsTxt', () => {
  it('points crawlers at the sitemap', () => {
    expect(renderRobotsTxt('https://docs.example/sitemap.xml')).toBe(
      'User-agent: *\nAllow: /\n\nSitemap: https://docs.example/sitemap.xml\n',
    )
  })
})
