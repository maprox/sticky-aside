import { applyTheme, readStoredTheme, THEME_KEY } from '../demo/theme.ts'
import type { SiteTheme } from '../demo/theme.ts'

export function bindThemeToggle(button: HTMLButtonElement, storage: Pick<Storage, 'getItem' | 'setItem'> = localStorage) {
  const paint = () => {
    const dark = document.documentElement.dataset.theme === 'dark'
    button.setAttribute('aria-pressed', dark ? 'true' : 'false')
    const label = dark ? button.dataset.labelLight : button.dataset.labelDark
    if (label) {
      button.setAttribute('aria-label', label)
    }
  }

  paint()

  button.addEventListener('click', () => {
    const next: SiteTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    try {
      storage.setItem(THEME_KEY, next)
    } catch {
      // Private mode can reject storage. The theme still switches for this visit.
    }
    paint()
  })

  if (typeof window.matchMedia !== 'function') {
    return
  }
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    if (readStoredTheme(storage)) {
      return
    }
    applyTheme(event.matches ? 'dark' : 'light')
    paint()
  })
}
