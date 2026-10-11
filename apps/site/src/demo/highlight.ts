const themeFor = {
  light: 'github-light',
  dark: 'github-dark',
} as const

export async function highlightCode(code: string, framework: string, tone: 'light' | 'dark'): Promise<string | null> {
  const lang = framework === 'vue' ? 'vue' : framework === 'svelte' ? 'svelte' : 'tsx'
  try {
    const shiki = await import('shiki')
    return await shiki.codeToHtml(code, {
      lang,
      theme: themeFor[tone],
    })
  } catch {
    return null
  }
}
