import type { APIRoute } from 'astro'

import { renderSitemapXml, sitemapUrls } from '#site/demo/seo.ts'

export const GET: APIRoute = ({ site }) => {
  const origin = site?.origin ?? 'https://maprox.github.io'
  const xml = renderSitemapXml(sitemapUrls(origin, import.meta.env.BASE_URL))

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
