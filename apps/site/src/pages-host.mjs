const PROJECT_SITE = 'https://maprox.github.io'
const PROJECT_BASE = '/sticky-aside'

export async function resolvePagesHost(env = process.env, fetchImpl = globalThis.fetch, cnameText = '') {
  if (env.SITE_ORIGIN) {
    return {
      site: env.SITE_ORIGIN,
      base: env.SITE_BASE || '/',
      cname: null,
    }
  }

  const fromFile = typeof cnameText === 'string' ? cnameText.trim() : ''
  if (fromFile !== '') {
    return { site: `https://${fromFile}`, base: '/', cname: fromFile }
  }

  const token = env.GITHUB_TOKEN
  const repo = env.GITHUB_REPOSITORY
  if (env.GITHUB_ACTIONS === 'true' && token && repo) {
    const response = await fetchImpl(`https://api.github.com/repos/${repo}/pages`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'sticky-aside-site',
      },
    })
    if (response.ok) {
      const data = await response.json()
      if (typeof data.cname === 'string' && data.cname !== '') {
        return { site: `https://${data.cname}`, base: '/', cname: data.cname }
      }
      if (typeof data.html_url === 'string') {
        const url = new URL(data.html_url)
        const path = url.pathname.replace(/\/$/, '')

        return { site: url.origin, base: path || '/', cname: null }
      }
    }
  }

  return { site: PROJECT_SITE, base: PROJECT_BASE, cname: null }
}
