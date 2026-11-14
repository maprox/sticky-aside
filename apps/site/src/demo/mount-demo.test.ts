import { afterEach, describe, expect, it, vi } from 'vitest'

import { mountMiniDemo } from '#site/demo/mount-demo.ts'

describe('mountMiniDemo scroll readout', () => {
  afterEach(() => {
    vi.useRealTimers()
    document.body.replaceChildren()
  })

  it('reports scroll direction only while the page is moving', () => {
    vi.useFakeTimers()
    const viewport = document.createElement('div')
    let top = 0
    Object.defineProperty(viewport, 'scrollTop', {
      configurable: true,
      get: () => top,
      set: (value: number) => {
        top = value
      },
    })
    document.body.append(viewport)

    const demo = mountMiniDemo({ viewport, locale: 'en' })
    expect(demo.getReadout().scrolling).toBe(false)

    viewport.scrollTop = 80
    viewport.dispatchEvent(new Event('scroll'))
    expect(demo.getReadout().scrolling).toBe(true)
    expect(demo.getReadout().scrollingUp).toBe(false)

    viewport.scrollTop = 20
    viewport.dispatchEvent(new Event('scroll'))
    expect(demo.getReadout().scrollingUp).toBe(true)

    vi.advanceTimersByTime(200)
    expect(demo.getReadout().scrolling).toBe(false)
    demo.destroy()
  })

  it('renders article and panel copy without repeated text', () => {
    const viewport = document.createElement('div')
    document.body.append(viewport)
    const demo = mountMiniDemo({ viewport, locale: 'en' })

    const texts = [...viewport.querySelectorAll('.mini-article p, .panel li')]
      .map((node) => node.textContent)

    expect(texts).toHaveLength(18)
    expect(new Set(texts).size).toBe(18)
    expect(texts.slice(12)).toEqual([
      'Scroll down: the panel pins its bottom edge to the window.',
      'Scroll up: it releases and pins its top edge instead.',
      'Between those moments the panel just rides with the page.',
      'Drag the lower edge of the window to change its height.',
      'Turn off the tall switch to compare with a short panel.',
      'Lock holds the panel at the height where you turned it on.',
    ])
    demo.destroy()
  })

  it('sizes the tall panel and demo page from the window height', () => {
    const viewport = document.createElement('div')
    Object.defineProperty(viewport, 'clientHeight', { configurable: true, value: 1300 })
    document.body.append(viewport)
    const demo = mountMiniDemo({ viewport, locale: 'en' })

    expect(viewport.querySelector('.panel')?.getAttribute('style')).toContain('min-height: 1460px')
    expect(viewport.querySelector('.mini-page')?.getAttribute('style')).toContain('min-height: 1860px')

    demo.setSettings({ tall: false })

    expect(viewport.querySelector('.panel')?.getAttribute('style') ?? '').not.toContain('min-height')
    expect(viewport.querySelector('.mini-page')?.getAttribute('style')).toContain('min-height: 1600px')
    demo.destroy()
  })
})
