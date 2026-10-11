import { afterEach, describe, expect, it, vi } from 'vitest'

import { bindThemeToggle } from '../scripts/theme-toggle.ts'
import { applyTheme, readStoredTheme, resolveTheme, THEME_KEY } from './theme.ts'

describe('theme', () => {
  afterEach(() => {
    document.body.replaceChildren()
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.style.colorScheme = ''
    localStorage.clear()
  })

  it('keeps a saved choice ahead of the system theme', () => {
    expect(resolveTheme('dark', false)).toBe('dark')
    expect(resolveTheme('light', true)).toBe('light')
    expect(resolveTheme(null, true)).toBe('dark')
    expect(resolveTheme('nope', false)).toBe('light')
  })

  it('paints the document and the demo tone', () => {
    const stage = document.createElement('main')
    stage.dataset.stage = ''
    stage.dataset.tone = 'light'
    document.body.append(stage)

    applyTheme('dark')

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(document.documentElement.style.colorScheme).toBe('dark')
    expect(stage.dataset.tone).toBe('dark')
  })

  it('reads nothing when storage is blocked', () => {
    const storage = {
      getItem: () => {
        throw new Error('blocked')
      },
    }
    expect(readStoredTheme(storage)).toBeNull()
  })

  it('switches theme from the button and remembers it', () => {
    document.documentElement.dataset.theme = 'light'
    const button = document.createElement('button')
    button.dataset.labelDark = 'Switch to dark theme'
    button.dataset.labelLight = 'Switch to light theme'
    document.body.append(button)
    const storage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
    }

    bindThemeToggle(button, storage)
    expect(button.getAttribute('aria-label')).toBe('Switch to dark theme')
    expect(button.getAttribute('aria-pressed')).toBe('false')

    button.click()

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(button.getAttribute('aria-pressed')).toBe('true')
    expect(button.getAttribute('aria-label')).toBe('Switch to light theme')
    expect(storage.setItem).toHaveBeenCalledWith(THEME_KEY, 'dark')
  })
})
