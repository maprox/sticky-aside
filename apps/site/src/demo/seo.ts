import { frameworkPath, localePath, t, withBase } from '#site/demo/i18n.ts'
import type { DemoFramework, DemoLocale } from '#site/demo/settings.ts'

export interface SeoCopy {
  title: string
  description: string
}

export interface HreflangLink {
  hreflang: string
  href: string
}

export function seoCopy(locale: DemoLocale, framework: DemoFramework): SeoCopy {
  return {
    title: t(locale, `seo.${framework}.title`),
    description: t(locale, `seo.${framework}.description`),
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
