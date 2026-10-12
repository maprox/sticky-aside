export const THEME_KEY = 'sticky-aside-theme'
export const THEME_EVENT = 'sticky-aside-theme'

export type SiteTheme = 'light' | 'dark'

export function resolveTheme(stored: string | null, isDarkPreferred: boolean): SiteTheme {
  if (stored === 'dark' || stored === 'light') {
    return stored
  }

  return isDarkPreferred ? 'dark' : 'light'
}

export function readStoredTheme(storage: Pick<Storage, 'getItem'>): string | null {
  try {
    return storage.getItem(THEME_KEY)
  } catch {
    return null
  }
}

export function applyTheme(theme: SiteTheme) {
  const root = document.documentElement
  root.dataset.theme = theme
  root.style.colorScheme = theme
  for (const stage of document.querySelectorAll<HTMLElement>('[data-stage]')) {
    stage.dataset.tone = theme
  }
  document.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: theme }))
}
