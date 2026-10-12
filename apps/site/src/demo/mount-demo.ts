import type { StickyAsideController, StickyAsideState } from '@sticky-aside/core'
import { createStickyAsidePresenter } from '@sticky-aside/core/headless'

import { createFrameView } from '#site/demo/frame-view.ts'
import { generateDemoCode } from '#site/demo/generate-code.ts'
import { articleLines, t } from '#site/demo/i18n.ts'
import { clampDemoSettings, DEFAULT_DEMO_SETTINGS } from '#site/demo/settings.ts'
import type { DemoLocale, DemoSettings } from '#site/demo/settings.ts'

export interface DemoReadout {
  state: StickyAsideState
  scrollingUp: boolean
  scrolling: boolean
}

export interface MiniDemoHandle {
  getSettings(): DemoSettings
  setSettings(patch: Partial<DemoSettings>): void
  getReadout(): DemoReadout
  getViewport(): HTMLElement
  destroy(): void
}

export function mountMiniDemo(options: {
  viewport: HTMLElement
  locale: DemoLocale
  code?: HTMLElement
  settings?: Partial<DemoSettings>
  onChange?: (settings: DemoSettings, readout: DemoReadout) => void
}): MiniDemoHandle {
  const viewport = options.viewport
  const page = document.createElement('div')
  page.className = 'mini-page'
  const article = document.createElement('article')
  article.className = 'mini-article'
  for (const line of [...articleLines(options.locale), ...articleLines(options.locale)]) {
    const p = document.createElement('p')
    p.textContent = line
    article.append(p)
  }
  const rail = document.createElement('div')
  rail.className = 'mini-rail'
  const wrapper = document.createElement('div')
  wrapper.className = 'sticky-aside-root'
  const content = document.createElement('div')
  rail.append(wrapper)
  wrapper.append(content)
  page.append(article, rail)
  viewport.replaceChildren(page)

  const scrollIdleMs = 200
  let settings = clampDemoSettings({ ...DEFAULT_DEMO_SETTINGS, ...options.settings })
  let state: StickyAsideState = 'off'
  let isScrollingUp = false
  let isScrolling = false
  let isAlive = true
  let scrollTimer: ReturnType<typeof setTimeout> | undefined
  let lastScroll = viewport.scrollTop

  const view = createFrameView({ viewport, wrapper, content })
  const aside: StickyAsideController = createStickyAsidePresenter(view, {
    locked: settings.locked,
    disabled: settings.disabled,
    allowLockedOverflowTop: settings.allowLockedOverflowTop,
    allowLockedOverflowBottom: settings.allowLockedOverflowBottom,
    onStateChange(next) {
      state = next
      emit()
    },
  })

  function paintPanel() {
    content.replaceChildren(panelBody(settings, options.locale))
  }

  function apply() {
    wrapper.style.setProperty('--sticky-aside-top', `${settings.top}px`)
    wrapper.style.setProperty('--sticky-aside-bottom', `${settings.bottom}px`)
    aside.setLocked(settings.locked)
    aside.setDisabled(settings.disabled)
    aside.setAllowLockedOverflow(settings.allowLockedOverflowTop, settings.allowLockedOverflowBottom)
    aside.update('resize')
    if (options.code && options.code.dataset.plainCode !== 'skip') {
      options.code.textContent = generateDemoCode(settings, options.locale)
    }
    emit()
  }

  function emit() {
    options.onChange?.(settings, { state, scrollingUp: isScrollingUp, scrolling: isScrolling })
  }

  function onScroll() {
    const next = viewport.scrollTop
    if (next === lastScroll) {
      return
    }
    isScrollingUp = next < lastScroll
    lastScroll = next
    isScrolling = true
    clearTimeout(scrollTimer)
    scrollTimer = setTimeout(() => {
      isScrolling = false
      if (isAlive) {
        emit()
      }
    }, scrollIdleMs)
    emit()
  }

  paintPanel()
  apply()
  viewport.addEventListener('scroll', onScroll, { passive: true })

  return {
    getSettings: () => settings,
    setSettings(patch) {
      const isPreviouslyTall = settings.tall
      settings = clampDemoSettings({ ...settings, ...patch })
      if (settings.tall !== isPreviouslyTall) {
        paintPanel()
      }
      apply()
    },
    getReadout: () => ({ state, scrollingUp: isScrollingUp, scrolling: isScrolling }),
    getViewport: () => viewport,
    destroy() {
      isAlive = false
      clearTimeout(scrollTimer)
      viewport.removeEventListener('scroll', onScroll)
      aside.destroy()
    },
  }
}

export function panelBody(settings: DemoSettings, locale: DemoLocale): HTMLElement {
  const body = document.createElement('div')
  body.className = 'panel'
  const copy = document.createElement('p')
  copy.className = 'panel-copy'
  copy.textContent = settings.tall ? t(locale, 'panel.tall') : t(locale, 'panel.short')
  body.append(copy)
  if (settings.tall) {
    const list = document.createElement('ol')
    for (const line of articleLines(locale)) {
      const item = document.createElement('li')
      item.textContent = line
      list.append(item)
    }
    body.append(list)
  }

  return body
}
