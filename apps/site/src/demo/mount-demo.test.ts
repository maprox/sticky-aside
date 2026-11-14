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

    expect(texts).toHaveLength(12)
    expect(new Set(texts).size).toBe(12)
    expect(texts.slice(8)).toEqual([
      'Drag the lower edge to resize the window.',
      'Toggle the tall panel to compare both modes.',
      'Lock the panel and keep scrolling.',
      'Disable sticky behavior to see the original layout.',
    ])
    demo.destroy()
  })
})
