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

    expect(texts).toHaveLength(24)
    expect(new Set(texts).size).toBe(24)
    expect(texts.slice(12)).toEqual([
      'Scroll down: the panel pins its bottom edge to the window.',
      'Scroll up: it releases and pins its top edge instead.',
      'Between those moments the panel just rides with the page.',
      'Drag the lower edge of the window to change its height.',
      'Turn off the tall switch to compare with a short panel.',
      'Lock holds the panel at the height where you turned it on.',
      'Keep scrolling after the bottom edge lands: the article moves while the panel stays put.',
      'Reverse direction near the bottom to watch the panel travel before its top edge catches.',
      'The top and bottom offsets leave breathing room around the panel while it is pinned.',
      'A locked panel ignores the usual edge rules until you release the lock.',
      'Disabling sticky returns the panel to its ordinary place in the column.',
      'Resizing the window changes only its frame; the panel keeps its natural content height.',
    ])
    demo.destroy()
  })

  it('leaves panel and page sizing to content when settings change', () => {
    const viewport = document.createElement('div')
    let viewportHeight = 1300
    Object.defineProperty(viewport, 'clientHeight', {
      configurable: true,
      get: () => viewportHeight,
    })
    document.body.append(viewport)
    const demo = mountMiniDemo({ viewport, locale: 'en' })
    const page = viewport.querySelector<HTMLElement>('.mini-page')!
    const panel = viewport.querySelector<HTMLElement>('.panel')!

    expect(panel.querySelectorAll('li')).toHaveLength(12)
    expect(panel.style.minHeight).toBe('')
    expect(page.style.minHeight).toBe('')

    viewportHeight = 900
    demo.setSettings({ viewportHeight })

    expect(panel.style.minHeight).toBe('')
    expect(page.style.minHeight).toBe('')

    demo.setSettings({ tall: false })

    expect(viewport.querySelector('.panel ol')).toBeNull()
    expect(viewport.querySelector<HTMLElement>('.panel')?.style.minHeight).toBe('')
    expect(page.style.minHeight).toBe('')
    demo.destroy()
  })
})
