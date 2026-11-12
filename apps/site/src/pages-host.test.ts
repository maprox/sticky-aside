import { describe, expect, it } from 'vitest'

import { resolvePagesHost } from '#site/pages-host.mjs'

function jsonResponse(body: unknown) {
  return {
    ok: true,
    async json() {
      return body
    },
  }
}

describe('resolvePagesHost', () => {
  it('uses the GitHub project site when Pages has no custom domain', async () => {
    const host = await resolvePagesHost({})
    expect(host).toEqual({
      site: 'https://maprox.github.io',
      base: '/sticky-aside',
      cname: null,
    })
  })

  it('follows an explicit origin without calling Pages', async () => {
    const fetchImpl = () => {
      throw new Error('should not fetch')
    }
    const host = await resolvePagesHost(
      { SITE_ORIGIN: 'https://docs.example', SITE_BASE: '/docs' },
      fetchImpl,
    )
    expect(host).toEqual({ site: 'https://docs.example', base: '/docs', cname: null })
  })

  it('uses the CNAME file without calling Pages', async () => {
    const fetchImpl = () => {
      throw new Error('should not fetch')
    }
    const host = await resolvePagesHost(
      { GITHUB_ACTIONS: 'true', GITHUB_TOKEN: 'token', GITHUB_REPOSITORY: 'maprox/sticky-aside' },
      fetchImpl,
      'sticky-aside.maprox.net\n',
    )
    expect(host).toEqual({
      site: 'https://sticky-aside.maprox.net',
      base: '/',
      cname: 'sticky-aside.maprox.net',
    })
  })

  it('reads a custom domain from the Pages API', async () => {
    const host = await resolvePagesHost(
      { GITHUB_ACTIONS: 'true', GITHUB_TOKEN: 'token', GITHUB_REPOSITORY: 'maprox/sticky-aside' },
      async () => jsonResponse({
        cname: 'sticky-aside.maprox.net',
        html_url: 'https://maprox.github.io/sticky-aside/',
      }),
    )
    expect(host).toEqual({
      site: 'https://sticky-aside.maprox.net',
      base: '/',
      cname: 'sticky-aside.maprox.net',
    })
  })

  it('keeps the project path while the custom domain is unset', async () => {
    const host = await resolvePagesHost(
      { GITHUB_ACTIONS: 'true', GITHUB_TOKEN: 'token', GITHUB_REPOSITORY: 'maprox/sticky-aside' },
      async () => jsonResponse({ cname: null, html_url: 'https://maprox.github.io/sticky-aside/' }),
    )
    expect(host).toEqual({
      site: 'https://maprox.github.io',
      base: '/sticky-aside',
      cname: null,
    })
  })
})
