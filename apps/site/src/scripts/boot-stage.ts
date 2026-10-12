import { generateDemoCode } from '#site/demo/generate-code.ts'
import { highlightCode } from '#site/demo/highlight.ts'
import {
  frameworkFromPath,
  frameworkPath,
  localePath,
  sitePath,
  stateReadout,
  switchLocalePath,
  t,
  withBase,
} from '#site/demo/i18n.ts'
import { mountMiniDemo } from '#site/demo/mount-demo.ts'
import type { DemoReadout, MiniDemoHandle } from '#site/demo/mount-demo.ts'
import { VIEWPORT_HEIGHT_MAX, VIEWPORT_HEIGHT_MIN } from '#site/demo/settings.ts'
import type { DemoFramework, DemoLocale, DemoSettings } from '#site/demo/settings.ts'
import { THEME_EVENT } from '#site/demo/theme.ts'

const BOOL_KEYS = ['locked', 'disabled', 'allowLockedOverflowTop', 'allowLockedOverflowBottom'] as const
const NUM_KEYS = ['top', 'bottom'] as const

function readTone(stage: HTMLElement): 'light' | 'dark' {
  const root = document.documentElement.dataset.theme
  if (root === 'dark' || root === 'light') {
    return root
  }

  return stage.dataset.tone === 'dark' ? 'dark' : 'light'
}

export function bootStage(stage: HTMLElement) {
  const locale = (stage.dataset.locale === 'ru' ? 'ru' : 'en') as DemoLocale
  const framework = readFramework(stage)
  const viewport = stage.querySelector<HTMLElement>('[data-viewport]')
  if (!viewport) {
    return
  }

  const code = stage.querySelector<HTMLElement>('[data-code]') ?? undefined
  const scrubHost = stage.querySelector<HTMLElement>('[data-scrub-host]')
  if (scrubHost && code) {
    code.dataset.plainCode = 'skip'
  }

  let highlightToken = 0
  const drag = { on: false, key: '' }
  const handle: { current?: MiniDemoHandle } = {}

  function paintCode(settings: DemoSettings) {
    if (!code || scrubHost) {
      return
    }
    const token = ++highlightToken
    void highlightCode(generateDemoCode(settings, locale), settings.framework, readTone(stage)).then((html) => {
      if (html && token === highlightToken && stage.isConnected) {
        code.innerHTML = html
      }
    })
  }

  const demo = mountMiniDemo({
    viewport,
    locale,
    code,
    settings: { framework },
    onChange(settings, readout) {
      paintReadout(stage, locale, readout)
      syncKnobs(stage, settings)
      syncFrameworks(stage, settings.framework)
      if (scrubHost) {
        if (handle.current) {
          paintScrub(scrubHost, settings, handle.current, drag, locale)
        }
      } else {
        paintCode(settings)
      }
    },
  })
  handle.current = demo
  document.addEventListener(THEME_EVENT, () => {
    if (stage.isConnected && handle.current) {
      paintCode(handle.current.getSettings())
    }
  })

  bindFrameworks(stage, demo, locale)
  bindKnobs(stage, demo)
  bindResize(stage, demo, locale)
  if (scrubHost) {
    paintScrub(scrubHost, demo.getSettings(), demo, drag, locale)
  }

  return demo
}

function paintReadout(stage: HTMLElement, locale: DemoLocale, readout: DemoReadout) {
  const node = stage.querySelector<HTMLElement>('[data-readout]')
  if (!node) {
    return
  }
  node.dataset.state = readout.state
  node.textContent = stateReadout(locale, readout.state, readout.scrolling, readout.scrollingUp)
}

function readFramework(stage: HTMLElement): DemoFramework {
  const value = stage.dataset.framework
  if (value === 'vanilla' || value === 'vue' || value === 'react' || value === 'svelte') {
    return value
  }

  return frameworkFromPath(sitePath(location.pathname))
}

function syncLangLink(locale: DemoLocale) {
  const link = document.querySelector<HTMLAnchorElement>('a.lang')
  if (!link) {
    return
  }
  link.setAttribute('href', withBase(switchLocalePath(locale, location.pathname)))
}

function syncFrameworks(stage: HTMLElement, framework: DemoFramework) {
  stage.querySelectorAll<HTMLElement>('[data-framework]').forEach((tab) => {
    tab.setAttribute('aria-selected', tab.dataset.framework === framework ? 'true' : 'false')
    tab.removeAttribute('aria-pressed')
  })
}

function bindFrameworks(stage: HTMLElement, demo: MiniDemoHandle, locale: DemoLocale) {
  stage.querySelectorAll<HTMLElement>('[data-framework]').forEach((tab) => {
    tab.addEventListener('click', (event) => {
      const framework = tab.dataset.framework
      if (
        framework !== 'vanilla' &&
        framework !== 'vue' &&
        framework !== 'react' &&
        framework !== 'svelte' &&
        framework !== 'solid' &&
        framework !== 'astro'
      ) {
        return
      }
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
        return
      }
      event.preventDefault()
      const url = withBase(localePath(locale, frameworkPath(framework)))
      if (location.pathname !== url) {
        history.pushState(null, '', url)
      }
      demo.setSettings({ framework })
      syncLangLink(locale)
    })
  })
  window.addEventListener('popstate', () => {
    demo.setSettings({ framework: frameworkFromPath(sitePath(location.pathname)) })
    syncLangLink(locale)
  })
  syncFrameworks(stage, demo.getSettings().framework)
}

function bindKnobs(stage: HTMLElement, demo: MiniDemoHandle) {
  const tall = stage.querySelector<HTMLInputElement>('[data-tall]')
  const lock = stage.querySelector<HTMLInputElement>('[data-lock]')
  const disabled = stage.querySelector<HTMLInputElement>('[data-disabled]')
  const overflowTop = stage.querySelector<HTMLInputElement>('[data-overflow-top]')
  const overflowBottom = stage.querySelector<HTMLInputElement>('[data-overflow-bottom]')
  const top = stage.querySelector<HTMLInputElement>('[data-top]')
  const bottom = stage.querySelector<HTMLInputElement>('[data-bottom]')

  tall?.addEventListener('change', () => demo.setSettings({ tall: tall.checked }))
  lock?.addEventListener('change', () => demo.setSettings({ locked: lock.checked }))
  disabled?.addEventListener('change', () => demo.setSettings({ disabled: disabled.checked }))
  overflowTop?.addEventListener('change', () => {
    demo.setSettings({ allowLockedOverflowTop: overflowTop.checked })
  })
  overflowBottom?.addEventListener('change', () => {
    demo.setSettings({ allowLockedOverflowBottom: overflowBottom.checked })
  })
  top?.addEventListener('input', () => demo.setSettings({ top: Number(top.value) }))
  bottom?.addEventListener('input', () => demo.setSettings({ bottom: Number(bottom.value) }))
  syncKnobs(stage, demo.getSettings())
}

function bindResize(stage: HTMLElement, demo: MiniDemoHandle, locale: DemoLocale) {
  const handle = stage.querySelector<HTMLElement>('[data-resize-height]')
  const frame = stage.querySelector<HTMLElement>('.cf-stage') ??
    stage.querySelector<HTMLElement>('[data-viewport]')
  if (!handle || !frame) {
    return
  }
  const resizeHandle = handle
  resizeHandle.setAttribute('aria-label', t(locale, 'knob.viewport'))
  resizeHandle.setAttribute('aria-valuemin', String(VIEWPORT_HEIGHT_MIN))
  resizeHandle.setAttribute('aria-valuemax', String(VIEWPORT_HEIGHT_MAX))
  syncResize(resizeHandle, readFrameHeight(frame, demo))

  const writeHeight = (next: number) => {
    const height = Math.min(VIEWPORT_HEIGHT_MAX, Math.max(VIEWPORT_HEIGHT_MIN, Math.round(next)))
    frame.style.height = `${height}px`
    demo.setSettings({ viewportHeight: height })
    syncResize(resizeHandle, height)
  }

  resizeHandle.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) {
      return
    }
    event.preventDefault()
    try {
      resizeHandle.setPointerCapture(event.pointerId)
    } catch {
      // A synthetic pointer has no active id. Real drags still capture.
    }
    const startY = event.clientY
    const start = readFrameHeight(frame, demo)
    function move(next: PointerEvent) {
      writeHeight(start + (next.clientY - startY))
    }
    function up() {
      resizeHandle.removeEventListener('pointermove', move)
      resizeHandle.removeEventListener('pointerup', up)
    }
    resizeHandle.addEventListener('pointermove', move)
    resizeHandle.addEventListener('pointerup', up)
  })

  resizeHandle.addEventListener('keydown', (event) => {
    const step = event.shiftKey ? 40 : 16
    const current = readFrameHeight(frame, demo)
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      writeHeight(current + step)
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      writeHeight(current - step)
    }
  })
}

function readFrameHeight(frame: HTMLElement, demo: MiniDemoHandle): number {
  const laidOut = frame.getBoundingClientRect().height
  if (laidOut > 0) {
    return laidOut
  }

  return demo.getSettings().viewportHeight
}

function syncResize(handle: HTMLElement, height: number) {
  handle.setAttribute('aria-valuenow', String(height))
}

function syncKnobs(stage: HTMLElement, settings: DemoSettings) {
  setCheck(stage, '[data-tall]', settings.tall)
  setCheck(stage, '[data-lock]', settings.locked)
  setCheck(stage, '[data-disabled]', settings.disabled)
  setCheck(stage, '[data-overflow-top]', settings.allowLockedOverflowTop)
  setCheck(stage, '[data-overflow-bottom]', settings.allowLockedOverflowBottom)
  setNumber(stage, '[data-top]', settings.top)
  setNumber(stage, '[data-bottom]', settings.bottom)
}

function setCheck(stage: HTMLElement, selector: string, isChecked: boolean) {
  const input = stage.querySelector<HTMLInputElement>(selector)
  if (input && document.activeElement !== input) {
    input.checked = isChecked
  }
}

function setNumber(stage: HTMLElement, selector: string, value: number) {
  const input = stage.querySelector<HTMLInputElement>(selector)
  if (!input) {
    return
  }
  const min = Number(input.min)
  const max = Number(input.max)
  const span = max - min || 1
  const pct = Math.min(100, Math.max(0, ((value - min) / span) * 100))
  input.style.setProperty('--fill', `${pct}%`)
  // Always write value: a focused dial after a mouse drag still needs to follow scrub edits.
  input.value = String(value)
}

interface DragState {
  on: boolean
  key: string
}

function paintScrub(
  host: HTMLElement,
  settings: DemoSettings,
  demo: MiniDemoHandle,
  drag: DragState,
  locale: DemoLocale,
) {
  if (drag.on) {
    const live = host.querySelector<HTMLElement>(`[data-scrub="${drag.key}"]`)
    if (live && (drag.key === 'top' || drag.key === 'bottom')) {
      live.textContent = String(settings[drag.key])
    }

    return
  }
  host.replaceChildren()
  const code = generateDemoCode(settings, locale)
  const pattern = /(\d+)px|\b(true|false)\b/g
  let last = 0
  let px = 0
  let bools = 0
  for (const match of code.matchAll(pattern)) {
    const index = match.index ?? 0
    host.append(document.createTextNode(code.slice(last, index)))
    if (match[1] && px < NUM_KEYS.length) {
      const key = NUM_KEYS[px]
      px += 1
      host.append(scrubNumber(key, match[1], demo, drag, locale), document.createTextNode('px'))
    } else if (match[2] && bools < BOOL_KEYS.length) {
      const key = BOOL_KEYS[bools]
      bools += 1
      host.append(scrubBool(key, match[2], demo))
    } else {
      host.append(document.createTextNode(match[0]))
    }
    last = index + match[0].length
  }
  host.append(document.createTextNode(code.slice(last)))
}

function scrubNumber(key: 'top' | 'bottom', value: string, demo: MiniDemoHandle, drag: DragState, locale: DemoLocale) {
  const span = document.createElement('span')
  span.className = 'scrub-num'
  span.dataset.scrub = key
  span.textContent = value
  span.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) {
      return
    }
    event.preventDefault()
    span.setPointerCapture(event.pointerId)
    drag.on = true
    drag.key = key
    const startY = event.clientY
    const start = demo.getSettings()[key]
    function move(next: PointerEvent) {
      demo.setSettings({ [key]: start + Math.round((startY - next.clientY) / 2) })
    }
    function up() {
      drag.on = false
      span.removeEventListener('pointermove', move)
      span.removeEventListener('pointerup', up)
      paintScrub(span.closest('[data-scrub-host]')!, demo.getSettings(), demo, drag, locale)
    }
    span.addEventListener('pointermove', move)
    span.addEventListener('pointerup', up)
  })

  return span
}

function scrubBool(key: (typeof BOOL_KEYS)[number], value: string, demo: MiniDemoHandle) {
  const span = document.createElement('span')
  span.className = 'scrub-bool'
  span.dataset.toggle = key
  span.textContent = value
  span.addEventListener('click', () => {
    demo.setSettings({ [key]: !demo.getSettings()[key] })
  })

  return span
}
