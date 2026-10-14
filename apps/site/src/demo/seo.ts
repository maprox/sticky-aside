import { frameworkPath, localePath, t, withBase } from '#site/demo/i18n.ts'
import { DEMO_FRAMEWORKS, type DemoFramework, type DemoLocale } from '#site/demo/settings.ts'

export interface SeoCopy {
  title: string
  description: string
  h1: string
}

export interface HreflangLink {
  hreflang: string
  href: string
}

const DEMO_LOCALES: DemoLocale[] = ['en', 'ru']

export function seoCopy(locale: DemoLocale, framework: DemoFramework): SeoCopy {
  return {
    title: t(locale, `seo.${framework}.title`),
    description: t(locale, `seo.${framework}.description`),
    h1: t(locale, `seo.${framework}.h1`),
  }
}

function withTrailingSlash(path: string): string {
  return path.endsWith('/') ? path : `${path}/`
}

export function pageHref(
  origin: string,
  locale: DemoLocale,
  framework: DemoFramework,
  base?: string,
): string {
  const path = withTrailingSlash(withBase(localePath(locale, frameworkPath(framework)), base))

  return `${origin.replace(/\/$/, '')}${path}`
}

export function hreflangLinks(
  origin: string,
  framework: DemoFramework,
  base?: string,
): HreflangLink[] {
  const en = pageHref(origin, 'en', framework, base)
  const ru = pageHref(origin, 'ru', framework, base)

  return [
    { hreflang: 'en', href: en },
    { hreflang: 'ru', href: ru },
    { hreflang: 'x-default', href: en },
  ]
}

/** Absolute URLs for every locale × framework demo page (trailing slash). */
export function sitemapUrls(origin: string, base?: string): string[] {
  const urls: string[] = []
  for (const locale of DEMO_LOCALES) {
    for (const framework of DEMO_FRAMEWORKS) {
      urls.push(pageHref(origin, locale, framework, base))
    }
  }

  return urls
}

export function renderSitemapXml(urls: string[]): string {
  const body = urls
    .map((loc) => `  <url>\n    <loc>${escapeXml(loc)}</loc>\n  </url>`)
    .join('\n')
  const xmlns = 'http://www.sitemaps.org/schemas/sitemap/0.9'

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="${xmlns}">\n${body}\n</urlset>\n`
}

export function renderRobotsTxt(sitemapUrl: string): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`
}

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}
