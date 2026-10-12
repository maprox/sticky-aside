import { afterEach, describe, expect, it, vi } from 'vitest'

import { createFrameView } from '#site/demo/frame-view.ts'

function box(element: HTMLElement, top: number, left: number, width: number, height: number) {
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
    top,
    left,
    right: left + width,
    bottom: top + height,
    width,
    height,
    x: left,
    y: top,
    toJSON() {
      return {}
    },
  })
}

function mount() {
  const viewport = document.createElement('div')
  const page = document.createElement('div')
  const wrapper = document.createElement('div')
  const content = document.createElement('div')
  page.append(wrapper)
  wrapper.append(content)
  const frame = document.createElement('div')
  frame.append(viewport)
  viewport.append(page)
  document.body.append(frame)
  Object.defineProperty(viewport, 'scrollTop', { value: 40, writable: true })
  Object.defineProperty(viewport, 'clientHeight', { value: 300 })
  Object.defineProperty(viewport, 'scrollHeight', { value: 900 })
  box(viewport, 80, 10, 400, 300)
  box(wrapper, 100, 220, 160, 800)
  box(content, 100, 220, 160, 500)

  return { viewport, wrapper, content }
}

describe('createFrameView', () => {
  afterEach(() => {
    document.body.replaceChildren()
    vi.restoreAllMocks()
  })

  it('reads boxes relative to the viewport', () => {
    const { viewport, wrapper, content } = mount()
    const view = createFrameView({ viewport, wrapper, content })
    const reading = view.read()
    expect(reading.metrics).toEqual({
      scrollY: 40,
      viewportHeight: 300,
      documentHeight: 900,
    })
    expect(reading.wrapper.top).toBe(20)
    expect(reading.content.top).toBe(20)
    expect(viewport.parentElement?.style.transform).toBe('translateZ(0)')
    view.destroy()
  })

  it('does not listen to window scroll', () => {
    const { viewport, wrapper, content } = mount()
    const add = vi.spyOn(window, 'addEventListener')
    const view = createFrameView({ viewport, wrapper, content })
    view.subscribe({
      scroll() {},
      resize() {},
    })
    const scrollTargets = add.mock.calls.filter((call) => call[0] === 'scroll')
    expect(scrollTargets).toEqual([])
    view.destroy()
  })

  it('paints a pinned top state', () => {
    const { viewport, wrapper, content } = mount()
    const view = createFrameView({ viewport, wrapper, content })
    view.paint({ state: 'top', width: 160 })
    expect(content.style.position).toBe('fixed')
    expect(content.style.width).toBe('160px')
    expect(content.classList.contains('sticky-aside-top')).toBe(true)
    expect(content.dataset.stickyAside).toBe('top')
    expect(content.style.pointerEvents).toBe('none')
    view.destroy()
  })

  it('removes the measure and the scroll listener on destroy', () => {
    const { viewport, wrapper, content } = mount()
    const view = createFrameView({ viewport, wrapper, content })
    const scroll = vi.fn()
    view.subscribe({ scroll, resize() {} })
    expect(wrapper.querySelector('[data-sticky-measure]')).not.toBeNull()
    view.destroy()
    expect(wrapper.querySelector('[data-sticky-measure]')).toBeNull()
    viewport.dispatchEvent(new Event('scroll'))
    expect(scroll).not.toHaveBeenCalled()
  })
})
