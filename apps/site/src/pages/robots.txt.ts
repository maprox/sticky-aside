import type { APIRoute } from 'astro'

import { renderRobotsTxt } from '#site/demo/seo.ts'

export const GET: APIRoute = ({ site }) => {
  const origin = (site?.origin ?? 'https://maprox.github.io').replace(/\/$/, '')
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/')
  const body = renderRobotsTxt(`${origin}${base}sitemap.xml`)

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
