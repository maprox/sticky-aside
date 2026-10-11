import { afterEach, describe, expect, it, vi } from 'vitest'

import { stateReadout } from '../demo/i18n.ts'
import { bootStage } from './boot-stage.ts'

describe('bootStage', () => {
  const screenHeight = window.innerHeight

  afterEach(() => {
    document.body.replaceChildren()
    history.replaceState(null, '', '/')
    setScreenHeight(screenHeight)
  })

  it('paints the code-first snippet without reading the demo before it exists', () => {
    const stage = document.createElement('section')
    stage.dataset.locale = 'en'
    stage.innerHTML = '<div data-viewport></div><div data-scrub-host></div><pre data-code></pre>'
    document.body.append(stage)

    expect(() => bootStage(stage)).not.toThrow()
    expect(stage.querySelector('[data-scrub="top"]')?.textContent).toBe('16')
  })

  it('selects a framework tab with aria-selected', () => {
    const stage = document.createElement('section')
    stage.dataset.locale = 'en'
    stage.innerHTML = `
      <div data-viewport></div>
      <div role="tablist">
        <a role="tab" href="/" data-framework="vanilla" aria-pressed="true">Vanilla</a>
        <a role="tab" href="/vue" data-framework="vue" aria-pressed="false">Vue</a>
      </div>
    `
    document.body.append(stage)

    bootStage(stage)

    const vanilla = stage.querySelector<HTMLAnchorElement>('[data-framework="vanilla"]')
    const vue = stage.querySelector<HTMLAnchorElement>('[data-framework="vue"]')
    expect(vanilla?.getAttribute('aria-selected')).toBe('true')
    expect(vue?.getAttribute('aria-selected')).toBe('false')
    expect(vanilla?.hasAttribute('aria-pressed')).toBe(false)
    expect(vue?.hasAttribute('aria-pressed')).toBe(false)

    vue?.click()

    expect(location.pathname).toBe('/vue')
    expect(vanilla?.getAttribute('aria-selected')).toBe('false')
    expect(vue?.getAttribute('aria-selected')).toBe('true')
    expect(vanilla?.hasAttribute('aria-pressed')).toBe(false)
    expect(vue?.hasAttribute('aria-pressed')).toBe(false)
  })

  it('sends the language link to the framework now in the address', () => {
    history.replaceState(null, '', '/vue')
    const lang = document.createElement('a')
    lang.className = 'lang'
    lang.setAttribute('href', '/ru/vue')
    document.body.append(lang)
    const stage = document.createElement('section')
    stage.dataset.locale = 'en'
    stage.innerHTML = `
      <div data-viewport></div>
      <a role="tab" href="/" data-framework="vanilla">Vanilla</a>
      <a role="tab" href="/vue" data-framework="vue">Vue</a>
    `
    document.body.append(stage)

    bootStage(stage)
    stage.querySelector<HTMLAnchorElement>('[data-framework="vanilla"]')?.click()

    expect(location.pathname).toBe('/')
    expect(lang.getAttribute('href')).toBe('/ru/')
  })

  it('selects the framework from the page address', () => {
    const stage = document.createElement('section')
    stage.dataset.locale = 'ru'
    stage.dataset.framework = 'react'
    stage.innerHTML = `
      <div data-viewport></div>
      <a role="tab" href="/ru/" data-framework="vanilla">Vanilla</a>
      <a role="tab" href="/ru/react" data-framework="react">React</a>
    `
    document.body.append(stage)

    bootStage(stage)

    expect(stage.querySelector('[data-framework="react"]')?.getAttribute('aria-selected')).toBe('true')
    expect(stage.querySelector('[data-framework="vanilla"]')?.getAttribute('aria-selected')).toBe('false')

    stage.querySelector<HTMLAnchorElement>('[data-framework="vanilla"]')?.click()

    expect(location.pathname).toBe('/ru/')
    expect(stage.querySelector('[data-framework="vanilla"]')?.getAttribute('aria-selected')).toBe('true')
  })

  it('leaves the window height to CSS until the edge is dragged', () => {
    const stage = document.createElement('section')
    stage.dataset.locale = 'en'
    stage.innerHTML = '<div class="cf-stage"><div data-viewport></div><div data-resize-height role="slider" tabindex="0"></div></div>'
    document.body.append(stage)

    bootStage(stage)

    expect(stage.querySelector<HTMLElement>('.cf-stage')?.style.height).toBe('')
    expect(stage.querySelector<HTMLElement>('[data-viewport]')?.style.height).toBe('')
  })

  it('writes the panel sentence into the status line', () => {
    const stage = document.createElement('section')
    stage.dataset.locale = 'en'
    stage.innerHTML = '<div data-viewport></div><p data-readout></p>'
    document.body.append(stage)

    const demo = bootStage(stage)
    const node = stage.querySelector<HTMLElement>('[data-readout]')
    const readout = demo?.getReadout()

    expect(node?.dataset.state).toBe(readout?.state)
    expect(node?.textContent).toBe(stateReadout('en', readout!.state, readout!.scrolling, readout!.scrollingUp))
    expect(node?.textContent).not.toContain('·')
    demo?.destroy()
  })

  it('resizes the window from the bottom edge', () => {
    const stage = document.createElement('section')
    stage.dataset.locale = 'en'
    stage.innerHTML = '<div class="cf-stage"><div data-viewport></div><div data-resize-height role="slider" tabindex="0"></div></div>'
    document.body.append(stage)
    const frame = stage.querySelector<HTMLElement>('.cf-stage')!
    vi.spyOn(frame, 'getBoundingClientRect').mockReturnValue(new DOMRect(0, 0, 400, 800))

    const demo = bootStage(stage)
    const handle = stage.querySelector<HTMLElement>('[data-resize-height]')
    expect(frame.style.height).toBe('')

    handle?.dispatchEvent(new PointerEvent('pointerdown', { clientY: 100, button: 0, bubbles: true }))
    handle?.dispatchEvent(new PointerEvent('pointermove', { clientY: 160, bubbles: true }))
    handle?.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }))

    expect(demo?.getSettings().viewportHeight).toBe(860)
    expect(frame.style.height).toBe('860px')
    expect(handle?.getAttribute('aria-valuenow')).toBe('860')
  })

})

function setScreenHeight(height: number) {
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: height })
}
